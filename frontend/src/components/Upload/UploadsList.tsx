import React from 'react';
import { ProjectDetailsDocument, ProjectDocument, UploadDto, useDeleteUploadMutation } from '../../generated/graphql';
import { Upload, UploadStyles } from './Upload';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { DeleteUploadDialog } from './DeleteUploadDialog';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
  paper: {
    maxHeight: '18rem',
    overflow: 'auto',
  },
});

interface Props {
  projectId: number;
  uploads: UploadDto[];
}

export const UploadsList: React.FC<Props> = ({ projectId, uploads }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [upload, setUpload] = React.useState(0);

  const [deleteUpload, { error }] = useDeleteUploadMutation({
    update(cache, { data }) {
      handleCloseDeleteDialog();

      try {
        if (data?.deleteUpload) {
          cache.writeQuery({
            query: ProjectDocument,
            variables: { id: data.deleteUpload.project.id },
            data: {
              uploads: data.deleteUpload.project.uploads,
              projectFiles: data.deleteUpload.project.projectFiles,
            },
          });

          cache.evict({
            fieldName: 'projectDetails',
            broadcast: false,
          });

          let size = 0;
          if (data.deleteUpload.project.uploads.length > 0) {
            size = data.deleteUpload.project.uploads.map(upload => upload.size).reduce((a: number, b: number) => a + b);
          }

          cache.writeQuery({
            query: ProjectDetailsDocument,
            variables: { id: data.deleteUpload.project.id },
            data: { size },
          });

          enqueueSnackbar('The uploaded file has been successfully deleted.', { variant: 'success' });
        }
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  });

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }

  const onSelectDelete = (uploadId: number): void => {
    handleOpenDeleteDialog();
    setUpload(uploadId);
  };

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
  const handleSubmitDeleteDialog = async (uploadId: number): Promise<void> => {
    await deleteUpload({ variables: { uploadId } });
  };

  return (
    <>
      <Paper elevation={2} className={classes.paper}>
        { uploads.map(upload => (
          <Upload
            key={upload.id}
            projectId={projectId}
            upload={upload}
            onSelectDelete={onSelectDelete}
          />
        )) }
        { uploads.length === 0 && (
          <UploadStyles>
            <Typography className="no-upload">
              There are no uploaded files for this project.
            </Typography>
          </UploadStyles>
        ) }
      </Paper>
      <DeleteUploadDialog
        uploadId={upload}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleSubmitDeleteDialog}
      />
    </>
  );
};

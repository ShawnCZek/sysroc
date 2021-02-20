import React from 'react';
import blue from '@material-ui/core/colors/blue';
import ProjectUploadButton from './Button/ProjectUploadButton';
import { Box, Button, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { Assessment, Code, Description, PresentToAll } from '@material-ui/icons';
import {
  Maybe,
  ProjectDetailsDocument,
  ProjectDocument,
  UploadDto,
  useProjectDetailsQuery,
  useUploadProjectFilesMutation,
} from '../../generated/graphql';
import { ComponentLoading } from '../ComponentLoading';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { UploadDetails } from './UploadDetails';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

const useStyles = makeStyles({
  buttonWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  uploadBox: {
    textAlign: 'center',
    marginBottom: '1rem',
    position: 'relative',
    padding: '0 1.1rem',
  },
  uploadInput: {
    display: 'none',
  },
  buttonProgress: {
    color: blue[300],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export interface ProjectFiles {
  documentation?: Maybe<Pick<UploadDto, 'id'>>;
  presentation?: Maybe<Pick<UploadDto, 'id'>>;
  analysis?: Maybe<Pick<UploadDto, 'id'>>;
  project?: Maybe<Pick<UploadDto, 'id'>>;
}

interface Props {
  projectId: number;
  uploads: UploadDto[];
  projectFiles?: ProjectFiles | null;
}

export const UploadForm: React.FC<Props> = ({ projectId, uploads, projectFiles }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [submitting, setSubmitting] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);
  type ProjectUploadButtonHandle = React.ElementRef<typeof ProjectUploadButton>;
  const documentationRef = React.useRef<ProjectUploadButtonHandle>(null);
  const presentationRef = React.useRef<ProjectUploadButtonHandle>(null);
  const analysisRef = React.useRef<ProjectUploadButtonHandle>(null);
  const projectRef = React.useRef<ProjectUploadButtonHandle>(null);

  const { data: details, loading: detailsLoading } = useProjectDetailsQuery({ variables: { id: projectId } });
  const [uploadProjectFiles] = useUploadProjectFilesMutation({
    update(cache, { data }) {
      formRef.current?.reset();
      documentationRef.current?.reset();
      presentationRef.current?.reset();
      analysisRef.current?.reset();
      projectRef.current?.reset();

      try {
        if (data?.uploadProjectFiles) {
          cache.writeQuery({
            query: ProjectDocument,
            variables: { id: projectId },
            data: {
              uploads: data.uploadProjectFiles.uploads,
              projectFiles: data.uploadProjectFiles.projectFiles,
            },
          });

          cache.evict({
            fieldName: 'projectDetails',
            broadcast: false,
          });

          let size = 0;
          if (data.uploadProjectFiles.uploads.length > 0) {
            size = data.uploadProjectFiles.uploads.map(upload => upload.size).reduce((a: number, b: number) => a + b);
          }

          cache.writeQuery({
            query: ProjectDetailsDocument,
            variables: { id: projectId },
            data: { size },
          });
        }

        enqueueSnackbar('Files have been successfully uploaded!', { variant: 'success' });
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }

      setSubmitting(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
      setSubmitting(false);
    },
  });

  const documentation = uploads.find(upload => upload.id === projectFiles?.documentation?.id);
  const presentation = uploads.find(upload => upload.id === projectFiles?.presentation?.id);
  const analysis = uploads.find(upload => upload.id === projectFiles?.analysis?.id);
  const project = uploads.find(upload => upload.id === projectFiles?.project?.id);

  const canManageProjects = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  if (detailsLoading || !details?.projectDetails) return <ComponentLoading />;

  if (!details.projectDetails.isAuthor && !canManageProjects) {
    return (
      <div className={classes.buttonWrapper}>
        <div className={classes.uploadBox}>
          <Typography variant="h6">
            Documentation
          </Typography>
          <UploadDetails color="primary" upload={documentation} />
        </div>
        <div className={classes.uploadBox}>
          <Typography variant="h6">
            Presentation
          </Typography>
          <UploadDetails color="secondary" upload={presentation} />
        </div>
        <div className={classes.uploadBox}>
          <Typography variant="h6">
            Analysis
          </Typography>
          <UploadDetails upload={analysis} />
        </div>
        <div className={classes.uploadBox}>
          <Typography variant="h6">
            Project
          </Typography>
          <UploadDetails color="primary" upload={project} />
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ documentation: null, presentation: null, analysis: null, project: null }}
      onSubmit={async () => {
        if (!documentationRef.current?.getFile() && !presentationRef.current?.getFile() && !analysisRef.current?.getFile() && !projectRef.current?.getFile()) {
          enqueueSnackbar('Nothing to upload.', { variant: 'info' });
          return;
        }

        setSubmitting(true);
        await uploadProjectFiles({
          variables: {
            documentation: documentationRef.current?.getFile(),
            presentation: presentationRef.current?.getFile(),
            analysis: analysisRef.current?.getFile(),
            project: projectRef.current?.getFile(),
            projectId,
          },
        });
      }}
    >
      <Form encType="multipart/form-data" ref={formRef}>
        <div className={classes.buttonWrapper}>
          <div className={classes.uploadBox}>
            <Typography variant="h6">
              Documentation
            </Typography>
            <UploadDetails color="primary" upload={documentation}>
              <ProjectUploadButton
                inputId="upload-documentation"
                inputName="documentation"
                variant="contained"
                color="primary"
                startIcon={<Description />}
                ref={documentationRef}
              />
            </UploadDetails>
          </div>
          <div className={classes.uploadBox}>
            <Typography variant="h6">
              Presentation
            </Typography>
            <UploadDetails color="secondary" upload={presentation}>
              <ProjectUploadButton
                inputId="upload-presentation"
                inputName="presentation"
                variant="contained"
                color="secondary"
                startIcon={<PresentToAll />}
                ref={presentationRef}
              />
            </UploadDetails>
          </div>
          <div className={classes.uploadBox}>
            <Typography variant="h6">
              Analysis
            </Typography>
            <UploadDetails upload={analysis}>
              <ProjectUploadButton
                inputId="upload-analysis"
                inputName="analysis"
                variant="contained"
                startIcon={<Assessment />}
                ref={analysisRef}
              />
            </UploadDetails>
          </div>
          <div className={classes.uploadBox}>
            <Typography variant="h6">
              Project
            </Typography>
            <UploadDetails color="primary" upload={project}>
              <ProjectUploadButton
                inputId="upload-project"
                inputName="project"
                variant="contained"
                color="primary"
                startIcon={<Code />}
                ref={projectRef}
              />
            </UploadDetails>
          </div>
        </div>
        <Box mt="1.5rem" className={classes.uploadBox}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            Upload
          </Button>
          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Box>
      </Form>
    </Formik>
  );
};

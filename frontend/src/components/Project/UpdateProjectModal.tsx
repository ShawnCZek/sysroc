import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { UpdateProjectForm } from './UpdateProjectForm';
import { ProjectDto, ProjectTasksDocument, useUpdateProjectMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 600,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: '95%',
      overflowY: 'auto'
    }
  })
);

const GET_PROJECT = ProjectTasksDocument;

interface Props {
  open: boolean;
  handleClose: () => void;
  projectId: number;
  data: ProjectDto;
}

export const UpdateProjectModal: React.FC<Props> = ({
  open,
  handleClose,
  projectId,
  data,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [modalStyle] = React.useState(getModalStyle);
  const [updateProject, { error }] = useUpdateProjectMutation({
    update(cache, result) {
      try {
        cache.writeQuery({
          query: GET_PROJECT,
          variables: { _id: projectId },
          data: {
            project: result.data?.updateProject
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
    }
  });

  return (
    <Modal
      aria-labelledby="update project"
      aria-describedby="modal with form to update project"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id="new-project-modal-title">New Project</h2>
        <p id="new-project-modal-description">Create something great</p>
        <UpdateProjectForm
          data={data}
          error={error}
          onSubmit={async ({ name, description, supervisor }) => {
            const res = await updateProject({
              variables: { name, description, supervisor, projectId }
            });
            if (res.data) {
              enqueueSnackbar('Project updated!', { variant: 'success' });
              handleClose();
            }
          }}
        />
      </div>
    </Modal>
  );
};

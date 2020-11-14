import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { UpdateTaskForm } from './UpdateTaskForm';
import { ProjectTasksDocument, useTaskQuery, useUpdateTaskMutation } from '../../generated/graphql';
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
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

const GET_PROJECT = ProjectTasksDocument;

interface Props {
  open: boolean;
  handleClose: () => void;
  task: number;
  projectId: number;
}

export const UpdateTaskModal: React.FC<Props> = ({
  open,
  handleClose,
  task,
  projectId,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [modalStyle] = React.useState(getModalStyle);
  const { data, loading } = useTaskQuery({ variables: { id: task } });
  const [updateTask, { error }] = useUpdateTaskMutation({
    update(cache, result) {
      try {
        const { project }: any = cache.readQuery({
          query: GET_PROJECT,
          variables: { id: projectId }
        });

        const index = project.tasks.findIndex(
          (task: any) => task.id === result.data?.updateTask.id
        );

        project.tasks[index] = result.data?.updateTask;

        cache.writeQuery({
          query: GET_PROJECT,
          variables: { id: projectId },
          data: {
            project: project
          }
        });

        enqueueSnackbar('Task updated!', { variant: 'success' });
        handleClose();
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  });

  if (loading) return null;

  return (
    <Modal
      aria-labelledby="update task"
      aria-describedby="modal with form to update task"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id="new-project-modal-title">Update Task</h2>
        {data?.task && (
          <UpdateTaskForm
            error={error}
            task={data.task}
            onSubmit={async ({ name, description, dueDate }) => {
              await updateTask({
                variables: { name, description, dueDate, id: task }
              });
            }}
          />
        )}
      </div>
    </Modal>
  );
};

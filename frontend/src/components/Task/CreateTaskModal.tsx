import React from 'react';
import Modal from '@material-ui/core/Modal';
import { CreateTaskForm } from './CreateTaskForm';
import { ProjectTasksDocument, useCreateTaskMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ModalBody } from '../Layout/Modal/ModalBody';

const GET_PROJECT = ProjectTasksDocument;

interface Props {
  open: boolean;
  handleClose: () => void;
  project: number;
}

export const CreateTaskModal: React.FC<Props> = ({
  open,
  handleClose,
  project
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [createTask, { error }] = useCreateTaskMutation({
    update(cache, result) {
      try {
        cache.writeQuery({
          query: GET_PROJECT,
          variables: { id: project },
          data: {
            project: result.data?.createTask.project
          }
        });

        enqueueSnackbar('Task successfully created!', { variant: 'success' });
        handleClose();
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  });

  return (
    <Modal
      aria-labelledby="new task"
      aria-describedby="modal with form to create a new project task"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>New Task</h2>
        <p>Get the work done.</p>
        <CreateTaskForm
          error={error}
          onSubmit={async ({ name, description, dueDate }) => {
            await createTask({
              variables: { name, dueDate, description, project }
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

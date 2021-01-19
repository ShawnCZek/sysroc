import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { UpdateTaskForm } from './UpdateTaskForm';
import { ProjectTasksDocument, useTaskQuery, useUpdateTaskMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ComponentLoading } from '../ComponentLoading';

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
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useTaskQuery({ variables: { id: task } });
  const [updateTask, { error }] = useUpdateTaskMutation({
    update(cache, result) {
      try {
        const { project }: any = cache.readQuery({
          query: GET_PROJECT,
          variables: { id: projectId }
        });

        const tasks = project.tasks.slice();

        const index = tasks.findIndex(
          (task: any) => task.id === result.data?.updateTask.id
        );

        tasks[index] = result.data?.updateTask;

        cache.writeQuery({
          query: GET_PROJECT,
          variables: { id: projectId },
          data: {
            project: { ...project, tasks },
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

  if (loading || !data?.task) return <ComponentLoading />;

  return (
    <Modal
      aria-labelledby="update task"
      aria-describedby="modal with form to update task"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>Update Task</h2>
        <UpdateTaskForm
          error={error}
          task={data.task}
          onSubmit={async ({ name, description, dueDate }) => {
            await updateTask({
              variables: { name, description, dueDate, id: task }
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

import React from 'react';
import Modal from '@material-ui/core/Modal';
import { NewProjectForm } from './NewProjectForm';
import { useCreateProjectMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ModalBody } from '../Layout/Modal/ModalBody';

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const NewProjectModal: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [createProject, { error, client }] = useCreateProjectMutation({
    async update() {
      await client.resetStore();
      enqueueSnackbar('Project created!', { variant: 'success' });
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="new project"
      aria-describedby="modal with form to create new project"
      open={open}
      onClose={handleClose}
    >
      <ModalBody width={600}>
        <NewProjectForm
          error={error}
          onSubmit={async ({ name, description }) => {
            await createProject({
              variables: { name, description }
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

import React from 'react';
import Modal from '@material-ui/core/Modal';
import { NewUserForm } from './NewUserForm';
import { useCreateUserMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ModalBody } from '../Layout/Modal/ModalBody';

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const NewUserModal: React.FC<Props> = ({
  open,
  handleClose
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [createUser, { error, client }] = useCreateUserMutation({
    async update() {
      enqueueSnackbar('User created!', { variant: 'success' });
      client?.resetStore();
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="new user"
      aria-describedby="modal with form to create new user"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2 id="new-user-modal-title">New User</h2>
        <p id="new-user-modal-description">Create new user account.</p>
        <NewUserForm
          error={error}
          onSubmit={async ({ name, email, adEmail, password, roles }) => {
            await createUser({
              variables: { name, email, adEmail, password, roleSlugs: roles }
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

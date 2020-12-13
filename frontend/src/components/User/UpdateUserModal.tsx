import React from 'react';
import Modal from '@material-ui/core/Modal';
import { useUpdateUserMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { UpdateUserForm } from './UpdateUserForm';
import { ModalBody } from '../Layout/Modal/ModalBody';

interface Props {
  open: boolean;
  handleClose: () => void;
  userId: number;
  data: {
    name: string;
    email: string;
    roles?: string[];
    groups?: number[];
  };
}

export const UpdateUserModal: React.FC<Props> = ({
  open,
  handleClose,
  userId,
  data,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [updateUser, { error, client }] = useUpdateUserMutation({
    async update() {
      enqueueSnackbar('User updated!', { variant: 'success' });
      client?.resetStore();
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="update user"
      aria-describedby="modal with form to update an existing user"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2 id="update-user-modal-title">Edit User</h2>
        <p id="update-user-modal-description">Edit the user account.</p>
        <UpdateUserForm
          error={error}
          userData={data}
          onSubmit={async ({ name, email, roles, groups }) => {
            await updateUser({
              variables: { name, email, roleSlugs: roles, groups, userId }
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

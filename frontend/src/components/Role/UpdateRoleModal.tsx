import React from 'react';
import { useSnackbar } from 'notistack';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { RoleForm } from './RoleForm';
import { useUpdateRoleMutation } from '../../generated/graphql';

interface Values {
  name: string;
  admin: boolean;
  permissions: string[];
}

interface Props {
  open: boolean;
  handleClose: () => void;
  roleId: number;
  data: Values;
}

export const UpdateRoleModal: React.FC<Props> = ({
  open,
  handleClose,
  roleId,
  data,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [updateRole, { error, client }] = useUpdateRoleMutation({
    async update(cache, result) {
      if (result.data?.updateRole) {
        await client.resetStore();
        enqueueSnackbar('Successfully updated the role!', { variant: 'success' });
        handleClose();
      }
    }
  });

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' })
  }

  return (
    <Modal
      aria-labelledby="update role"
      aria-describedby="modal with form to update an existing role"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>Edit Role</h2>
        <p>Edit the existing role.</p>
        <RoleForm
          error={error}
          roleData={data}
          onSubmit={async (values) => {
            await updateRole({ variables: { id: roleId, ...values } });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

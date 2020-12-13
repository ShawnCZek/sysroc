import React from 'react';
import { useSnackbar } from 'notistack';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { RoleForm } from './RoleForm';
import { RolesDocument, RolesQuery, useUpdateRoleMutation } from '../../generated/graphql';

interface Values {
  name: string;
  admin: boolean;
  teacher: boolean;
  student: boolean;
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

  const [updateRole, { error }] = useUpdateRoleMutation({
    update(cache, result) {
      try {
        if (result.data?.updateRole) {
          const { roles }: any = cache.readQuery({ query: RolesDocument });

          const index = roles.findIndex(
            (role: any) => role.id === result.data?.updateRole.id
          );

          roles[index] = result.data?.updateRole;

          cache.writeQuery<RolesQuery>({
            query: RolesDocument,
            data: { roles },
          });

          enqueueSnackbar('Successfully updated the role!', { variant: 'success' });
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
    }
  });

  return (
    <Modal
      aria-labelledby="update role"
      aria-describedby="modal with form to update an existing role"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2 id="update-user-modal-title">Edit Role</h2>
        <p id="update-user-modal-description">Edit the existing role.</p>
        <RoleForm
          error={error}
          roleData={data}
          onSubmit={async (values) => {
            await updateRole({ variables: { id: roleId, ...values } });
            handleClose();
          }}
        />
      </ModalBody>
    </Modal>
  );
};

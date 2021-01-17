import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { RoleForm } from './RoleForm';
import { useSnackbar } from 'notistack';
import { RolesDocument, RolesQuery, useCreateRoleMutation } from '../../generated/graphql';

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const NewRoleModal: React.FC<Props> = ({
  open,
  handleClose,
}, ref) => {
  const { enqueueSnackbar } = useSnackbar();

  const [createRole, { error }] = useCreateRoleMutation({
    update(cache, result) {
      try {
        if (result.data?.createRole) {
          const cacheRes: any = cache.readQuery({ query: RolesDocument });

          cache.writeQuery<RolesQuery>({
            query: RolesDocument,
            data: {
              roles: [...cacheRes.roles, result.data.createRole],
            },
          });

          enqueueSnackbar('Successfully created a role!', { variant: 'success' });
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
      aria-labelledby="new role"
      aria-describedby="modal with form to create new user role"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>New Role</h2>
        <p>Create a new user role.</p>
        <RoleForm
          error={error}
          roleData={{ name: '', admin: false, permissions: [] }}
          onSubmit={async (values) => {
            await createRole({ variables: values });
            handleClose();
          }}
        />
      </ModalBody>
    </Modal>
  );
};

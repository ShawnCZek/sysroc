import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import { RolesDocument, RolesQuery, useDeleteRoleMutation, useRolesQuery } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { BooleanIcon } from '../Layout/Icon/BooleanIcon';
import { Fab } from '@material-ui/core';
import { UpdateRoleModal } from './UpdateRoleModal';
import { DeleteRoleDialog } from './DeleteRoleDialog';

const ItemIcon = styled.div`
  display: flex;
  align-items: space-around;
  justify-content: space-around;
`;

export const RolesList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [roleData, setRoleData] = useState<any>(null);

  const { data, loading } = useRolesQuery();

  const [deleteRole] = useDeleteRoleMutation({
    update(cache, result) {
      try {
        if (result.data?.deleteRole) {
          const { roles }: any = cache.readQuery({ query: RolesDocument });

          const index = roles.findIndex(
            (role: any) => role.id === result.data?.deleteRole.id
          );

          delete roles[index];

          cache.writeQuery<RolesQuery>({
            query: RolesDocument,
            data: { roles },
          });

          enqueueSnackbar('Successfully deleted the role!', { variant: 'success' });
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
    }
  });

  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleOpenEditModal = () => setEditModalOpen(true);

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
  const handleSubmitDeleteDialog = async (roleId: number) => {
    await deleteRole({ variables: { roleId } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Roles List</h2>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>Name</div>
            </Item>
            <Item>
              <div>System role</div>
            </Item>
            <Item>
              <div>Administrator</div>
            </Item>
            <Item>
              <div>Teacher</div>
            </Item>
            <Item>
              <div>Student</div>
            </Item>
            <Item>
              <div>Permissions</div>
            </Item>
            <Item>
              <div>Action</div>
            </Item>
          </div>
          { data?.roles && data.roles.map(role => (
            <div key={role.id} className="flex">
              <Item>
                <div>{role.name}</div>
              </Item>
              <Item>
                <ItemIcon><BooleanIcon check={role.system} /></ItemIcon>
              </Item>
              <Item>
                <ItemIcon><BooleanIcon check={role.admin} /></ItemIcon>
              </Item>
              <Item>
                <ItemIcon><BooleanIcon check={role.teacher} /></ItemIcon>
              </Item>
              <Item>
                <ItemIcon><BooleanIcon check={role.student} /></ItemIcon>
              </Item>
              <Item>
                <div>{role.admin ? <strong>All</strong> : role.permissions.map(permission => permission.name).join(', ')}</div>
              </Item>
              <Item className="actions">
                { !role.admin && (
                  <>
                    <Fab
                      color="primary"
                      variant="extended"
                      onClick={() => {
                        setSelectedRoleId(parseInt(role.id));
                        setRoleData({
                          name: role.name,
                          admin: role.admin,
                          teacher: role.teacher,
                          student: role.student,
                          permissions: role.permissions.map(permission => permission.slug),
                        });
                        handleOpenEditModal();
                      }}
                    >
                      Edit
                    </Fab>
                    { !role.system && (
                      <Fab
                        color="secondary"
                        variant="extended"
                        onClick={() => {
                          setSelectedRoleId(parseInt(role.id));
                          handleOpenDeleteDialog();
                        }}
                      >
                        Delete
                      </Fab>
                    )}
                  </>
                ) }
              </Item>
            </div>
          )) }
        </List>
      </Paper>
      <UpdateRoleModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        roleId={selectedRoleId ?? 0}
        data={roleData}
      />
      <DeleteRoleDialog
        roleId={selectedRoleId ?? 0}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleSubmitDeleteDialog}
      />
    </div>
  );
};

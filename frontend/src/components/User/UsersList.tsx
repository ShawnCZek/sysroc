import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Item } from '../Layout/Item';
import { List } from '../Layout/List';
import { useDeleteUserMutation, useMeQuery, useUsersQuery } from '../../generated/graphql';
import { Fab } from '@material-ui/core';
import { UpdateUserModal } from './UpdateUserModal';
import { UserFilters, UsersFilter } from './UsersFilter';
import { DeleteUserDialog } from './DeleteUserDialog';
import { useSnackbar } from 'notistack';
import { UserLink } from '../UserLink';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';
import { ROLES } from '../../generated/roles';

export const UsersList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [filters, setFilters] = useState<UserFilters>({ name: '', email: '', adEmail: '', groups: [], roles: [] });

  const { data: me, loading: meLoading } = useMeQuery();
  const { data, loading } = useUsersQuery({ variables: filters });

  const [deleteUser, { client }] = useDeleteUserMutation({
    async update(cache, result) {
      if (!result.data?.deleteUser) {
        enqueueSnackbar('An error occurred while deleting the user.', { variant: 'error' });
        return;
      }

      enqueueSnackbar('User deleted!', { variant: 'success' });
      client?.resetStore();
    }
  });

  const canManageTeachers = useHasPermissions(PERMISSIONS.MANAGE_TEACHER_USERS);
  const canManageStudents = useHasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS);
  const canDeleteUsers = useHasPermissions(PERMISSIONS.DELETE_USERS);
  const isAdmin = me?.me?.user?.roles && me.me.user.roles.some(role => role.admin);

  const handleCloseUserModal = () => setUserModalOpen(false);
  const handleOpenUserModal = () => setUserModalOpen(true);

  const handleCloseDeleteUserDialog = () => setDeleteUserModalOpen(false);
  const handleOpenDeleteUserDialog = () => setDeleteUserModalOpen(true);

  const handleSubmitDeleteUserDialog = async (userId: number) => {
    await deleteUser({ variables: { id: userId } });
  };

  if (loading || meLoading) return <span>Loading...</span>;

  return (
    <div>
      <UsersFilter
        defaultValues={filters}
        onSubmit={(filter: UserFilters) => {
          setFilters(filter);
        }}
      />
      <h2>Users List</h2>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>Username</div>
            </Item>
            <Item>
              <div>Email</div>
            </Item>
            <Item>
              <div>AD Email</div>
            </Item>
            <Item>
              <div>AD Groups</div>
            </Item>
            <Item>
              <div>Roles</div>
            </Item>
            <Item>
              <div>Action</div>
            </Item>
          </div>
          {data &&
          data.users &&
          data.users.map(user => (
            <div key={user.id} className="flex">
              <Item>
                <div><UserLink id={user.id} name={user.name} /></div>
              </Item>
              <Item>
                <div>{user.email}</div>
              </Item>
              <Item>
                <div>{user.adEmail}</div>
              </Item>
              <Item>
                <div>{user.groups && user.groups.map(group => group.name).join(', ')}</div>
              </Item>
              <Item>
                <div>{user.roles && user.roles.map(role => role.name).join(', ')}</div>
              </Item>
              <Item className="actions">
                {!user.roles.some(role => role.admin) && !user.roles.some(role => (role.slug === ROLES.TEACHER && !canManageTeachers) || (role.slug === ROLES.STUDENT && !canManageStudents)) &&
                  <Fab
                    color="primary"
                    variant="extended"
                    onClick={() => {
                      setSelectedUserId(parseInt(user.id));
                      setUserData({
                        name: user.name,
                        email: user.email,
                        roles: user.roles.map(role => role.slug),
                        groups: user.groups.map(group => parseInt(group.id)),
                      });
                      handleOpenUserModal();
                    }}
                  >
                    Edit
                  </Fab>
                }
                {canDeleteUsers
                  && user.id !== me?.me?.user?.id
                  && (!user.roles.some(role => role.admin) || isAdmin)
                  && !user.roles.some(role => (role.slug === ROLES.TEACHER && !canManageTeachers) || (role.slug === ROLES.STUDENT && !canManageStudents)) &&
                  <Fab
                    color="secondary"
                    variant="extended"
                    onClick={() => {
                      setSelectedUserId(parseInt(user.id));
                      handleOpenDeleteUserDialog();
                    }}
                  >
                    Delete
                  </Fab>
                }
              </Item>
            </div>
          ))}
        </List>
      </Paper>
      <UpdateUserModal
        open={userModalOpen}
        handleClose={handleCloseUserModal}
        userId={selectedUserId ?? 0}
        data={userData}
      />
      {canDeleteUsers &&
        <DeleteUserDialog
          userId={selectedUserId ?? 0}
          open={deleteUserModalOpen}
          onClose={handleCloseDeleteUserDialog}
          onSubmit={handleSubmitDeleteUserDialog}
        />
      }
    </div>
  );
};

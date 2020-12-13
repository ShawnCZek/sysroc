import React from 'react';
import { UsersHeader } from '../components/User/UsersHeader';
import { UsersList } from '../components/User/UsersList';
import { NewUserModal } from '../components/User/NewUserModal';

export const Users: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <UsersHeader handleOpen={handleOpen} />
      <UsersList />
      <NewUserModal
        open={open}
        handleClose={handleClose}
      />
    </>
  );
};

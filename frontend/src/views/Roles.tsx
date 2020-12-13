import React from 'react';
import { RolesHeader } from '../components/Role/RolesHeader';
import { RolesList } from '../components/Role/RolesList';
import { NewRoleModal } from '../components/Role/NewRoleModal';

export const Roles: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <RolesHeader handleOpen={handleOpen} />
      <RolesList />
      <NewRoleModal open={open} handleClose={handleClose} />
    </>
  );
};

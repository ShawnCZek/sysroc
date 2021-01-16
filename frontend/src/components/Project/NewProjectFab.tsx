import React from 'react';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';
import { NewProjectModal } from './NewProjectModal';
import { NewButton } from '../Layout/Button/NewButton';

export const NewProjectFab: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const canCreateProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);

  if (!canCreateProject) return null;

  return (
    <>
      <NewButton onClick={handleOpen}>
        New Project
      </NewButton>
      <NewProjectModal
        handleClose={handleClose}
        open={open}
      />
    </>
  );
};

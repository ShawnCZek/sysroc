import React from 'react';
import { Fab } from '@material-ui/core';
import { UpdateProjectModal } from './UpdateProjectModal';
import { ProjectDto, useProjectDetailsQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  project: ProjectDto;
}

export const UpdateProjectButton: React.FC<Props> = ({ project }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { data: details, loading } = useProjectDetailsQuery({ variables: { id: parseInt(project.id) } });
  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);
  const canManageProject = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  if (loading || !(canManageProject || (details?.projectDetails.isAuthor && canManageOwnProject))) return null;

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => {
          handleModalOpen();
        }}
      >
        Edit
      </Fab>
      <UpdateProjectModal
        open={modalOpen}
        handleClose={handleModalClose}
        projectId={parseInt(project.id)}
        data={project}
      />
    </>
  );
};

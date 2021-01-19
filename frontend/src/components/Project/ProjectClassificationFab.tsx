import React from 'react';
import { Fab } from '@material-ui/core';
import { ProjectClassificationOverview } from './ProjectClassificationOverview';
import { ClassificationDto, useProjectDetailsQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  projectId: number;
  classification: ClassificationDto[];
}

export const ProjectClassificationFab: React.FC<Props> = ({ projectId, classification }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { data, loading } = useProjectDetailsQuery({ variables: { id: projectId } });
  const canManageProject = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  if (loading || !data?.projectDetails.isAuthor || !canManageProject) return null;

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        onClick={() => {
          handleModalOpen();
        }}
      >
        Classification
      </Fab>
      <ProjectClassificationOverview
        open={modalOpen}
        handleClose={handleModalClose}
        classification={classification}
      />
    </>
  );
};

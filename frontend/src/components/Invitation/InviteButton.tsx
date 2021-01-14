import React from 'react';
import { Fab } from '@material-ui/core';
import { InviteModal } from './InviteModal';
import { useProjectDetailsQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  projectId: number;
}

export const InviteButton: React.FC<Props> = ({ projectId }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { data, loading } = useProjectDetailsQuery({ variables: { id: projectId } });
  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  if (loading || !data?.projectDetails.isAuthor || !canManageOwnProject) return null;

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => {
          handleModalOpen();
        }}
      >
        Invitations
      </Fab>
      <InviteModal
        open={modalOpen}
        handleClose={handleModalClose}
        projectId={projectId}
      />
    </>
  );
};

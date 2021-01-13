import React from 'react';
import { Fab } from '@material-ui/core';
import { InviteModal } from './InviteModal';

interface Props {
  projectId: number;
}

export const InviteButton: React.FC<Props> = ({ projectId }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => {
          handleModalOpen();
        }}
      >
        Invite
      </Fab>
      <InviteModal
        open={modalOpen}
        handleClose={handleModalClose}
        projectId={projectId}
      />
    </>
  );
};

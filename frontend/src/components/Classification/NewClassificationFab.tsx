import React from 'react';
import { NewButton } from '../Layout/Button/NewButton';
import { NewClassificationModal } from './NewClassificationModal';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  projectId?: number;
}

export const NewClassificationFab: React.FC<Props> = ({ projectId }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const canCreateClassification = useHasPermissions(PERMISSIONS.CLASSIFICATION_CREATE);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  if (!canCreateClassification) return null;

  return (
    <>
      <NewButton
        onClick={() => {
          handleModalOpen();
        }}
      >
        Add mark
      </NewButton>
      <NewClassificationModal
        open={modalOpen}
        handleClose={handleModalClose}
        projectId={projectId}
      />
    </>
  );
};

import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { ProjectInvitationsList } from './ProjectInvitationsList';
import { ProjectInvite } from './ProjectInvite';

interface Props {
  open: boolean;
  handleClose: () => void;
  projectId: number;
}

export const InviteModal: React.FC<Props> = ({ open, handleClose, projectId }) => (
  <Modal
    aria-labelledby="invite a user to the project"
    aria-describedby="modal with form to invite a user to the project"
    open={open}
    onClose={handleClose}
  >
    <ModalBody width={850}>
      <h2>Invitations</h2>
      <ProjectInvitationsList projectId={projectId} />
      <ProjectInvite handleClose={handleClose} projectId={projectId} />
    </ModalBody>
  </Modal>
);

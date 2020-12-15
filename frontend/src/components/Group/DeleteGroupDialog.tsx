import React from 'react';
import styled from 'styled-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DeleteDialog } from '../Layout/Dialog/DeleteDialog';

interface Props {
  groupId: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (groupId: number) => Promise<void>;
}

const DialogInnerText = styled.div`
  p {
    &:first-of-type {
      margin-top: 0;
    }
    
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export const DeleteGroupDialog: React.FC<Props> = ({
  groupId,
  open,
  onClose,
  onSubmit,
}) => (
  <DeleteDialog
    entity={groupId}
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
  >
    <DialogContentText>
      <DialogInnerText>
        <p>Are you sure you want to delete this group?</p>
        <p>Keep in mind that this group might get recreated if a new user has it assigned in the Active Directory application!</p>
      </DialogInnerText>
    </DialogContentText>
  </DeleteDialog>
);

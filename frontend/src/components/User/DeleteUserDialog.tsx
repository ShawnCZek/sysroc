import React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DeleteDialog } from '../Layout/Dialog/DeleteDialog';

interface Props {
  userId: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: number) => Promise<void>;
}

export const DeleteUserDialog: React.FC<Props> = ({
  userId,
  open,
  onClose,
  onSubmit,
}) => (
  <DeleteDialog
    entity={userId}
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
  >
    <DialogContentText>
      Are you sure you want to delete this user?
    </DialogContentText>
  </DeleteDialog>
);

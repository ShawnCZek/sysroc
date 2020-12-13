import React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DeleteDialog } from '../Layout/Dialog/DeleteDialog';

interface Props {
  roleId: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (roleId: number) => Promise<void>;
}

export const DeleteRoleDialog: React.FC<Props> = ({
  roleId,
  open,
  onClose,
  onSubmit,
}) => (
  <DeleteDialog
    entity={roleId}
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
  >
    <DialogContentText>
      Are you sure you want to delete this role?
    </DialogContentText>
  </DeleteDialog>
);

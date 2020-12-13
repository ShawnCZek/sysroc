import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  entity: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (entity: number) => Promise<void>;
}

export const DeleteDialog: React.FC<Props> = ({
  entity,
  open,
  onClose,
  onSubmit,
  children,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle>Delete Confirmation</DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}
        color="primary"
        autoFocus
      >
        Cancel
      </Button>
      <Button
        onClick={async () => onSubmit(entity).then(() => onClose())}
        color="secondary"
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

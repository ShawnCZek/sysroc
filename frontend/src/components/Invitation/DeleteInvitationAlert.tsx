import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleDeleteInvitation: (invitationId: number) => Promise<void>;
  invitationId: number | null;
}

export const DeleteInvitationAlert: React.FC<Props> = ({
  open,
  handleClose,
  handleDeleteInvitation,
  invitationId,
  children,
}) => {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Invitation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (invitationId) {
              handleDeleteInvitation(invitationId).then(handleClose);
            }
          }}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

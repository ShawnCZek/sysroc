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
  handleAcceptInvitation: (invitationId: number) => Promise<void>;
  invitationId: number | null;
}

export const AcceptInvitationAlert: React.FC<Props> = ({
  open,
  handleClose,
  handleAcceptInvitation,
  invitationId,
}) => (
  <Dialog
    open={open}
    keepMounted
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">Accept Invitation</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to accept the project invitation?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="default">
        Cancel
      </Button>
      <Button
        onClick={() => {
          if (invitationId) {
            handleAcceptInvitation(invitationId).then(handleClose);
          }
        }}
        color="primary"
      >
        Accept
      </Button>
    </DialogActions>
  </Dialog>
);

import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleDeleteAuthor: (authorId: number) => Promise<void>;
  authorId: number | null;
}

export const DeleteProjectAuthorAlert: React.FC<Props> = ({
  open,
  handleClose,
  handleDeleteAuthor,
  authorId,
}) => (
  <Dialog
    open={open}
    keepMounted
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">Revoke Access</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to remove the access for the user?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          if (authorId) {
            handleDeleteAuthor(authorId).then(handleClose);
          }
        }}
        color="secondary"
      >
        Revoke
      </Button>
    </DialogActions>
  </Dialog>
);

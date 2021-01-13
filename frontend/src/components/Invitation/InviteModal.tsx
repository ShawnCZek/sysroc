import React from 'react';
import Modal from '@material-ui/core/Modal';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useInviteMutation } from '../../generated/graphql';
import { InviteForm } from './InviteForm';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

interface Props {
  open: boolean;
  handleClose: () => void;
  projectId: number;
}

export const InviteModal: React.FC<Props> = ({ open, handleClose, projectId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [modalStyle] = React.useState(getModalStyle);

  const [invite, { error }] = useInviteMutation({
    update(cache, { data }) {
      if (data?.invite) {
        enqueueSnackbar('The user has been successfully invited to your project!', { variant: 'success' });
        handleClose();
      }
    }
  });

  return (
    <Modal
      aria-labelledby="invite a user to the project"
      aria-describedby="modal with form to invite a user to the project"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id="invite-user-modal-title">Invite User</h2>
        <p id="invite-user-modal-description">Invite a user to your project as an author.</p>
        <InviteForm
          error={error}
          onSubmit={async (userId) => {
            await invite({
              variables: { userId: userId.toString(), projectId: projectId.toString() },
            });
          }}
        />
      </div>
    </Modal>
  );
};

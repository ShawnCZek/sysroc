import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { NewUserForm } from './NewUserForm';
import { useCreateUserMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';

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
      padding: theme.spacing(2, 4, 3),
      maxHeight: '95%',
      overflowY: 'auto'
    }
  })
);

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const NewUserModal: React.FC<Props> = ({
  open,
  handleClose
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [modalStyle] = React.useState(getModalStyle);

  const [createUser, { error, client }] = useCreateUserMutation({
    async update() {
      client?.resetStore();
    }
  });

  return (
    <Modal
      aria-labelledby="new user"
      aria-describedby="modal with form to create new user"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id="new-user-modal-title">New User</h2>
        <p id="new-user-modal-description">Create new user account.</p>
        <NewUserForm
          error={error}
          onSubmit={async ({ name, email, adEmail, password, roles }) => {
            const res = await createUser({
              variables: { name, email, adEmail, password, roleSlugs: roles }
            });
            if (res.data) {
              enqueueSnackbar('User created!', { variant: 'success' });
              handleClose();
            }
          }}
        />
      </div>
    </Modal>
  );
};

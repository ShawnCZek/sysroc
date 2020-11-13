import React from "react";
import Modal from "@material-ui/core/Modal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { NewClassificationForm } from "./NewClassificationForm";
import { useCreateClassificationMutation } from "../../generated/graphql";

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
  userId?: string;
}

export const NewClassificationModal: React.FC<Props> = ({ open, handleClose, userId }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const { enqueueSnackbar } = useSnackbar();

  const [createClassification, { client }] = useCreateClassificationMutation({
    async update(cache, result) {
      if (!result.data?.createClassification) {
        enqueueSnackbar('An error occurred while adding classification.', { variant: 'error' });
        return;
      }

      enqueueSnackbar('Classification created!', { variant: 'success' });
      client?.resetStore();
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="new project"
      aria-describedby="modal with form to create new classification"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id="new-classification-modal-title">New Classification</h2>
        <p id="new-classification-modal-description">Select and mark project</p>
        <NewClassificationForm
          error=''
          userId={userId}
          onSubmit={async ({ mark, note, project }) => {
            await createClassification({
              variables: { mark, note, project: parseInt(project), user: parseInt(userId ?? '0') }
            });
          }}
        />
      </div>
    </Modal>
  )
};

import React from 'react';
import { useSnackbar } from 'notistack';
import { Modal } from '@material-ui/core';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { UpdateClassificationForm } from './UpdateClassificationForm';
import { useUpdateClassificationMutation } from '../../generated/graphql';

interface Props {
  open: boolean;
  handleClose: () => void;
  classificationId: number;
  userId?: string;
  data: {
    mark: number;
    note?: string;
    project: string;
  };
}

export const UpdateClassificationModal: React.FC<Props> = ({
  open,
  handleClose,
  classificationId,
  userId,
  data,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [updateClassification, { error, client }] = useUpdateClassificationMutation({
    async update() {
      await client.resetStore();
      enqueueSnackbar('Classification updated!', { variant: 'success' });
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="update classification"
      aria-describedby="modal with form to update classification"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>Update classification</h2>
        <p>Be gentle.</p>
        <UpdateClassificationForm
          data={data}
          error={error}
          onSubmit={async ({ mark, note, project }) => {
            await updateClassification({
              variables: { id: classificationId, mark, note, project: parseInt(project) },
            });
          }}
          userId={userId}
        />
      </ModalBody>
    </Modal>
  );
};

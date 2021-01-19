import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { useSnackbar } from 'notistack';
import { NewClassificationForm } from './NewClassificationForm';
import { useCreateClassificationMutation, useMeQuery } from '../../generated/graphql';

interface Props {
  open: boolean;
  handleClose: () => void;
  projectId?: number;
}

export const NewClassificationModal: React.FC<Props> = ({ open, handleClose, projectId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const me = useMeQuery();
  const [createClassification, { error, client }] = useCreateClassificationMutation({
    async update(cache, result) {
      if (!result.data?.createClassification) {
        enqueueSnackbar('An error occurred while adding classification.', { variant: 'error' });
        return;
      }

      await client.resetStore();
      enqueueSnackbar('Classification created!', { variant: 'success' });
      handleClose();
    },
  });

  if (me.loading || !me.data?.me) return null;

  return (
    <Modal
      aria-labelledby="new project"
      aria-describedby="modal with form to create new classification"
      open={open}
      onClose={handleClose}
    >
      <ModalBody>
        <h2>New Classification</h2>
        <p>Select and mark project</p>
        <NewClassificationForm
          error={error}
          userId={me.data.me.user?.id}
          projectId={projectId}
          onSubmit={async ({ mark, note, project }) => {
            await createClassification({
              variables: { mark, note, project: parseInt(project), user: parseInt(me.data!.me!.user!.id) },
            });
          }}
        />
      </ModalBody>
    </Modal>
  );
};

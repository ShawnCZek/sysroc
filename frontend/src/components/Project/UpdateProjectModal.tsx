import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { UpdateProjectForm } from './UpdateProjectForm';
import { ProjectDto, useUpdateProjectMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ProjectAuthorsOverview } from './Author/ProjectAuthorsOverview';

interface Props {
  open: boolean;
  handleClose: () => void;
  projectId: number;
  data: ProjectDto;
}

export const UpdateProjectModal: React.FC<Props> = ({
  open,
  handleClose,
  projectId,
  data,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [updateProject, { error, client }] = useUpdateProjectMutation({
    async update() {
      await client.resetStore();
      enqueueSnackbar('Project updated!', { variant: 'success' });
      handleClose();
    }
  });

  return (
    <Modal
      aria-labelledby="update project"
      aria-describedby="modal with form to update project"
      open={open}
      onClose={handleClose}
    >
      <ModalBody width={600}>
        <UpdateProjectForm
          data={data}
          error={error}
          onSubmit={async ({ name, description, supervisor }) => {
            await updateProject({
              variables: { name, description, supervisor, projectId }
            });
          }}
        />
        <ProjectAuthorsOverview projectId={projectId} />
      </ModalBody>
    </Modal>
  );
};

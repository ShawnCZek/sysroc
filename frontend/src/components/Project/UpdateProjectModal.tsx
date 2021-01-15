import React from 'react';
import Modal from '@material-ui/core/Modal';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { UpdateProjectForm } from './UpdateProjectForm';
import { ProjectDto, ProjectTasksDocument, useUpdateProjectMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ProjectAuthorsOverview } from './Author/ProjectAuthorsOverview';

const GET_PROJECT = ProjectTasksDocument;

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
  const [updateProject, { error }] = useUpdateProjectMutation({
    update(cache, result) {
      try {
        cache.writeQuery({
          query: GET_PROJECT,
          variables: { _id: projectId },
          data: {
            project: result.data?.updateProject
          }
        });

        enqueueSnackbar('Project updated!', { variant: 'success' });
        handleClose();
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
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

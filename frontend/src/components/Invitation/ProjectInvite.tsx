import React from 'react';
import { InviteForm } from './InviteForm';
import { useSnackbar } from 'notistack';
import { InvitationsDocument, useInviteMutation, useProjectDetailsQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  handleClose: () => void;
  projectId: number;
}

export const ProjectInvite: React.FC<Props> = ({ handleClose, projectId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useProjectDetailsQuery({ variables: { id: projectId } });
  const [invite, { error }] = useInviteMutation({
    update(cache, { data }) {
      try {
        const cacheRes: any = cache.readQuery({
          query: InvitationsDocument,
          variables: { projectId },
        });

        const invitations = [...cacheRes.invitations, data];

        cache.writeQuery({
          query: InvitationsDocument,
          variables: { projectId },
          data: {
            invitations: invitations,
          },
        });

        enqueueSnackbar('The user has been successfully invited to your project!', { variant: 'success' });
        handleClose();
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  });

  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);

  if (loading || !data?.projectDetails.isOwner || !canManageOwnProject) return null;

  return (
    <>
      <h2>Invite User</h2>
      <p>Invite a user to your project as an author.</p>
      <InviteForm
        error={error}
        onSubmit={async (email: string) => {
          await invite({
            variables: { email, projectId: projectId.toString() },
          });
        }}
      />
    </>
  );
};

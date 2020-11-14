import React from 'react';
import { useClaimProjectMutation, useMeQuery } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { hasPermissions } from '../../auth/hasPermissions';
import { Fab } from '@material-ui/core';

interface Props {
  projectId: number;
  hasSupervisor: boolean;
  supervisorId: number | null;
}

export const ClaimProjectFab: React.FC<Props> = ({
  projectId,
  hasSupervisor,
  supervisorId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: meData, loading } = useMeQuery();
  const canClaimProject = meData?.me && hasPermissions(meData.me, 'projects.claim');

  const [claimProject, { client }] = useClaimProjectMutation({
    update() {
      const message = hasSupervisor ? 'unclaimed' : 'claimed';
      enqueueSnackbar(`Project successfully ${message}!`, {variant: 'success'});
      client?.resetStore();
    }
  });

  if (loading) return <span>Loading...</span>;

  return (
    <>
      { canClaimProject && (!hasSupervisor || (meData?.me?.user && supervisorId === parseInt(meData.me.user.id))) ? (
        <Fab
          color="secondary"
          variant="extended"
          onClick={async () => {
            await claimProject({ variables: { projectId } });
          }}
        >
          { hasSupervisor ? 'Unclaim' : 'Claim' }
        </Fab>
      ) : (
        <div />
      )}
    </>
  );
};

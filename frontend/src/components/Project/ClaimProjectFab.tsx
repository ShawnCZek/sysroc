import React from 'react';
import { useClaimProjectMutation, useMeQuery } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { Fab } from '@material-ui/core';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

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
  const canClaimProject = useHasPermissions(PERMISSIONS.PROJECTS_CLAIM);

  const [claimProject, { client }] = useClaimProjectMutation({
    async update() {
      await client.resetStore();
      const message = hasSupervisor ? 'unclaimed' : 'claimed';
      enqueueSnackbar(`Project successfully ${message}!`, { variant: 'success' });
    },
  });

  if (loading || !canClaimProject || (hasSupervisor && supervisorId !== parseInt(meData!.me!.user!.id))) return null;

  return (
    <Fab
      color="secondary"
      variant="extended"
      onClick={async () => {
        await claimProject({ variables: { projectId } });
      }}
    >
      { hasSupervisor ? 'Unclaim' : 'Claim' }
    </Fab>
  );
};

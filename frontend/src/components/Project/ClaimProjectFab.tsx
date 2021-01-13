import React from 'react';
import { useClaimProjectMutation, useMeQuery } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { ComponentLoading } from '../ComponentLoading';
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
    update() {
      const message = hasSupervisor ? 'unclaimed' : 'claimed';
      enqueueSnackbar(`Project successfully ${message}!`, {variant: 'success'});
      client?.resetStore();
    }
  });

  if (loading) return <ComponentLoading />;

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

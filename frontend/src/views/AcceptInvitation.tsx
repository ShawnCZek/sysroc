import React from 'react';
import { useSnackbar } from 'notistack';
import { RouteComponentProps, useHistory } from 'react-router';
import { useAcceptInvitationMutation } from '../generated/graphql';
import { Loading } from '../components/Loading';
import { Home } from '../components/Home';

interface Props extends RouteComponentProps<{
  invitationId: string;
}> {}

export const AcceptInvitation: React.FC<Props> = props => {
  const invitationId = parseInt(props.match.params.invitationId);

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [acceptInvite, { client, error }] = useAcceptInvitationMutation({
    variables: { invitationId },
    async update(cache, { data }) {
      if (data?.acceptInvitation && !error) {
        await client.resetStore();
        enqueueSnackbar('The invitation to the project has been successfully accepted!', { variant: 'success' });
      }

      history.push('/');
    }
  });

  acceptInvite().catch(() => history.push('/'));

  return (
    <>
      <Loading transparent={false} />
      <Home />
    </>
  );
};

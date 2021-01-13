import React from 'react';
import moment from 'moment';
import { CheckCircle, CloseRounded } from '@material-ui/icons';
import { Fab, Paper } from '@material-ui/core';
import { PaperStyles } from '../Layout/Paper/PaperStyles';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import {
  MyInvitationsDocument,
  useAcceptInvitationMutation,
  useDeleteInvitationMutation,
  useMyInvitationsQuery,
} from '../../generated/graphql';
import { ProjectLink } from '../ProjectLink';
import { UserLink } from '../UserLink';
import { useSnackbar } from 'notistack';
import { AcceptInvitationAlert } from './AcceptInvitationAlert';
import { DeleteInvitationAlert } from './DeleteInvitationAlert';

export const InvitationsList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [acceptInvitationAlert, setAcceptInvitationAlert] = React.useState(false);
  const [deleteInvitationAlert, setDeleteInvitationAlert] = React.useState(false);
  const [invitationId, setInvitationId] = React.useState<number | null>(null);

  const { data, loading } = useMyInvitationsQuery();
  const [acceptInvitation, { error, client }] = useAcceptInvitationMutation({
    async update() {
      await client.resetStore();
      enqueueSnackbar('The invitation to the project has been successfully accepted!', { variant: 'success' });
    }
  });
  const [deleteInvitation, { error: deleteError }] = useDeleteInvitationMutation({
    update(cache, { data }) {
      try {
        const cacheRes: any = cache.readQuery({
          query: MyInvitationsDocument,
        });

        cache.writeQuery({
          query: MyInvitationsDocument,
          data: {
            myInvitations: cacheRes.myInvitations.filter((invitation: any) => invitation.id !== data?.deleteInvitation.id),
          },
        });

        enqueueSnackbar('The invitation has been rejected.', { variant: 'success' });
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  });

  const handleAcceptAlertOpen = () => setAcceptInvitationAlert(true);
  const handleAcceptAlertClose = () => setAcceptInvitationAlert(false);

  const handleDeleteAlertOpen = () => setDeleteInvitationAlert(true);
  const handleDeleteAlertClose = () => setDeleteInvitationAlert(false);

  if (error || deleteError) {
    enqueueSnackbar(error?.message || deleteError?.message, { variant: 'error' });
  }

  const handleAcceptInvitation = async (id: number) => {
    await acceptInvitation({
      variables: { invitationId: id },
    });
  };

  const handleDeleteInvitation = async (id: number) => {
    await deleteInvitation({
      variables: { invitationId: id },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Paper>
        <PaperStyles>
          <List>
            <div className="flex">
              <Item>
                <div>Project</div>
              </Item>
              <Item>
                <div>Authors</div>
              </Item>
              <Item>
                <div>Invited By</div>
              </Item>
              <Item>
                <div>Invited</div>
              </Item>
              <Item>
                <div>Actions</div>
              </Item>
            </div>
            { data?.myInvitations && data.myInvitations.map(invitation => (
              <div key={invitation.id} className="flex">
                <Item>
                  <div>
                    <ProjectLink id={invitation.project.id} name={invitation.project.name} />
                  </div>
                </Item>
                <Item>
                  <div>
                    { invitation.project.users.map(author => (
                      <div>
                        <UserLink id={author.id} name={author.name} />
                      </div>
                    )) }
                  </div>
                </Item>
                <Item>
                  <div>
                    <UserLink id={invitation.user.id} name={invitation.user.name} />
                  </div>
                </Item>
                <Item>
                  <div>{moment(invitation.createdAt).format('Do MMMM YYYY HH:mm')}</div>
                </Item>
                <Item className="actions">
                  <Fab
                    color="primary"
                    variant="extended"
                    onClick={() => {
                      setInvitationId(parseInt(invitation.id));
                      handleAcceptAlertOpen();
                    }}
                  >
                    <CheckCircle />
                  </Fab>
                  <Fab
                    color="secondary"
                    variant="extended"
                    onClick={() => {
                      setInvitationId(parseInt(invitation.id));
                      handleDeleteAlertOpen();
                    }}
                  >
                    <CloseRounded />
                  </Fab>
                </Item>
              </div>
            )) }
            { (!data?.myInvitations || data.myInvitations.length === 0) && (
              <div className="flex">
                <Item>
                  There are no invitations.
                </Item>
              </div>
            ) }
          </List>
        </PaperStyles>
      </Paper>
      <AcceptInvitationAlert
        open={acceptInvitationAlert}
        handleClose={handleAcceptAlertClose}
        handleAcceptInvitation={handleAcceptInvitation}
        invitationId={invitationId}
      />
      <DeleteInvitationAlert
        open={deleteInvitationAlert}
        handleClose={handleDeleteAlertClose}
        handleDeleteInvitation={handleDeleteInvitation}
        invitationId={invitationId}
      />
    </>
  );
};

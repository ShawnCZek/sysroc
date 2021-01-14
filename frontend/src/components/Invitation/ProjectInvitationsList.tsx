import React from 'react';
import moment from 'moment';
import { InvitationsDocument, useDeleteInvitationMutation, useInvitationsQuery } from '../../generated/graphql';
import { ComponentLoading } from '../ComponentLoading';
import { Fab, Paper } from '@material-ui/core';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { UserLink } from '../UserLink';
import { useSnackbar } from 'notistack';
import { DeleteInvitationAlert } from './DeleteInvitationAlert';
import { CloseRounded } from '@material-ui/icons';

interface Props {
  projectId: number;
}

export const ProjectInvitationsList: React.FC<Props> = ({ projectId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [deleteInvitationAlert, setDeleteInvitationAlert] = React.useState(false);
  const [invitationId, setInvitationId] = React.useState(0);

  const { data, loading } = useInvitationsQuery({ variables: { projectId } });
  const [deleteInvitation, { error }] = useDeleteInvitationMutation({
    update(cache, { data }) {
      try {
        const cacheRes: any = cache.readQuery({
          query: InvitationsDocument,
          variables: { projectId },
        });

        cache.writeQuery({
          query: InvitationsDocument,
          variables: { projectId },
          data: {
            invitations: cacheRes.invitations.filter((invitation: any) => invitation.id !== data?.deleteInvitation.id),
          },
        });

        enqueueSnackbar('The invitation has been deleted.', { variant: 'success' });
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    },
  });

  const handleDeleteAlertOpen = () => setDeleteInvitationAlert(true);
  const handleDeleteAlertClose = () => setDeleteInvitationAlert(false);

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }

  const handleDeleteInvitation = async (id: number) => {
    await deleteInvitation({
      variables: { invitationId: id },
    });
  };

  if (loading) return <ComponentLoading />;

  return (
    <>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>User</div>
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
          { data?.invitations && data.invitations.map(invitation => (
            <div key={invitation.id} className="flex">
              <Item>
                <div>
                  <UserLink id={invitation.invited.id} name={invitation.invited.name} />
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
              <Item>
                <div>
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
                </div>
              </Item>
            </div>
          )) }
          { (!data?.invitations || data.invitations.length === 0) && (
            <div className="flex">
              <Item>
                There are no invitations.
              </Item>
            </div>
          ) }
        </List>
      </Paper>
      <DeleteInvitationAlert
        open={deleteInvitationAlert}
        handleClose={handleDeleteAlertClose}
        handleDeleteInvitation={handleDeleteInvitation}
        invitationId={invitationId}
      >
        Are you sure you want to delete this invitation?
      </DeleteInvitationAlert>
    </>
  );
};

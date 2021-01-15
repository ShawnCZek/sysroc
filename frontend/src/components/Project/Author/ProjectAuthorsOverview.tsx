import React from 'react';
import { useDeleteProjectAuthorMutation, useProjectDetailsQuery, useProjectQuery } from '../../../generated/graphql';
import { useSnackbar } from 'notistack';
import { Fab, makeStyles, Paper, Typography } from '@material-ui/core';
import { List } from '../../Layout/List';
import { Item } from '../../Layout/Item';
import { UserLink } from '../../UserLink';
import { DeleteProjectAuthorAlert } from './DeleteProjectAuthorAlert';
import { useHasPermissions } from '../../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../../generated/permissions';

const useStyles = makeStyles({
  block: {
    margin: '1rem 2rem 2rem',
  },
  paper: {
    marginTop: '1rem',
  },
});

interface Props {
  projectId: number;
}

export const ProjectAuthorsOverview: React.FC<Props> = ({ projectId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [deleteAuthorAlert, setDeleteAuthorAlert] = React.useState(false);
  const [authorId, setAuthorId] = React.useState(0);

  const { data, loading } = useProjectQuery({ variables: { id: projectId } });
  const { data: details, loading: detailsLoading } = useProjectDetailsQuery({ variables: { id: projectId } });
  const [deleteAuthor, { error, client }] = useDeleteProjectAuthorMutation({
    async update() {
      await client.resetStore();
      enqueueSnackbar('The author has been successfully removed from the project.', { variant: 'success' });
    }
  });

  const handleDeleteAlertOpen = () => setDeleteAuthorAlert(true);
  const handleDeleteAlertClose = () => setDeleteAuthorAlert(false);

  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }

  const handleDeleteAuthor = async (id: number) => {
    await deleteAuthor({
      variables: { projectId, userId: id },
    });
  };

  if (loading || detailsLoading || !details?.projectDetails.isOwner || !canManageOwnProject) return null;

  return (
    <>
      <div className={classes.block}>
        <Typography variant="h4">
          Project Authors
        </Typography>
        <Paper className={classes.paper}>
          <List>
            <div className="flex">
              <Item>
                <div>User</div>
              </Item>
              <Item>
                <div>Actions</div>
              </Item>
            </div>
            { data?.project.users && data.project.users.map(author => (
              <div key={author.id} className="flex">
                <Item>
                  <div>
                    <UserLink id={author.id} name={author.name} />
                  </div>
                </Item>
                <Item>
                  <div>
                    { author.id !== data.project.owner.id &&
                      <Fab
                        color="secondary"
                        variant="extended"
                        onClick={() => {
                          setAuthorId(parseInt(author.id));
                          handleDeleteAlertOpen();
                        }}
                      >
                        Revoke Access
                      </Fab>
                    }
                  </div>
                </Item>
              </div>
            )) }
          </List>
        </Paper>
      </div>
      <DeleteProjectAuthorAlert
        open={deleteAuthorAlert}
        handleClose={handleDeleteAlertClose}
        handleDeleteAuthor={handleDeleteAuthor}
        authorId={authorId}
      />
    </>
  );
};

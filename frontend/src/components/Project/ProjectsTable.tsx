import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { PaperStyles } from '../Layout/Paper/PaperStyles';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { UserLink } from '../UserLink';
import { Fab } from '@material-ui/core';
import { DeleteProjectAlert } from './DeleteProjectAlert';
import { ProjectsAuthors } from './ProjectsAuthors';
import { ProjectsQuery, useDeleteProjectMutation, useMeQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

interface Props {
  projects: ProjectsQuery['projects'];
}

export const ProjectsTable: React.FC<Props> = ({ projects }) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [deleteProjectAlert, setDeleteProjectAlert] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const { data: meData } = useMeQuery();
  const [deleteProject, { error, client }] = useDeleteProjectMutation({
    update() {
      client?.resetStore();
      enqueueSnackbar('Project successfully deleted', { variant: 'success' });
    }
  });

  const canDeleteOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);
  const canDeleteProject = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  const handleAlertOpen = () => setDeleteProjectAlert(true);
  const handleDeleteAlertClose = () => setDeleteProjectAlert(false);

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }

  const handleDeleteProject = async (id: number) => {
    await deleteProject({
      variables: { projectId: id }
    });
  };

  return (
    <>
      <Paper>
        <PaperStyles>
          <List>
            <div className="flex">
              <Item>
                <div>Name</div>
              </Item>
              <Item>
                <div>Authors</div>
              </Item>
              <Item>
                <div>Supervisor</div>
              </Item>
              <Item className="description">
                <div>Description</div>
              </Item>
              <Item>
                <div>Created</div>
              </Item>
              <Item>
                <div>Action</div>
              </Item>
            </div>
            { projects && projects.map(project => (
              <div key={project.id} className="flex">
                <Item>
                  <div>{project.name}</div>
                </Item>
                <Item>
                  <div>
                    <ProjectsAuthors authors={project.users} />
                  </div>
                </Item>
                <Item>
                  <div>
                    {project.supervisor && <UserLink id={parseInt(project.supervisor.id)} name={project.supervisor.name} />}
                  </div>
                </Item>
                <Item className="description">
                  <div>{project.description.slice(0, 100)}{!project.description || project.description.length > 100 ? '...' : ''}</div>
                </Item>
                <Item>
                  <div>{moment(project.createdAt).format('Do MMMM YYYY HH:mm')}</div>
                </Item>
                <Item className="actions">
                  <Fab
                    color="primary"
                    variant="extended"
                    onClick={() => {
                      history.push(`/projects/${project.id}`);
                    }}
                  >
                    View
                  </Fab>
                  { (canDeleteProject || (project.users.some(author => author.id === meData?.me?.user?.id) && canDeleteOwnProject)) &&
                  <Fab
                    color="secondary"
                    variant="extended"
                    onClick={() => {
                      setProjectId(parseInt(project.id));
                      handleAlertOpen();
                    }}
                  >
                    <DeleteIcon />
                  </Fab>
                  }
                </Item>
              </div>
            ))}
            { (!projects || projects.length === 0) && (
              <div className="flex">
                <Item>
                  There are no projects.
                </Item>
              </div>
            ) }
          </List>
        </PaperStyles>
      </Paper>
      <DeleteProjectAlert
        open={deleteProjectAlert}
        handleClose={handleDeleteAlertClose}
        handleDeleteProject={handleDeleteProject}
        projectId={projectId}
      />
    </>
  );
};

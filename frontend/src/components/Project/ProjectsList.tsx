import React, { useState } from 'react';
import { useDeleteProjectMutation, useMeQuery, useProjectsQuery } from '../../generated/graphql';
import Paper from '@material-ui/core/Paper';
import { Fab } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { DeleteProjectAlert } from './DeleteProjectAlert';
import { useHistory } from 'react-router';
import { Item } from '../Layout/Item';
import { List } from '../Layout/List';
import styled from 'styled-components';
import { UserLink } from '../UserLink';
import { ProjectFilters, ProjectsFilter } from './ProjectsFilter';
import { hasPermissions } from '../../auth/hasPermissions';

const PaperStyles = styled.div`
  & > div {
    overflow-x: auto;
  }
  
  & .flex > div {
    min-width: 10rem;
    
    &.description {
      min-width: 20rem;
    }
  }
`;

interface Props {
  userId?: string;
  displayAuthor: boolean;
}

export const ProjectsList: React.FC<Props> = ({
  userId,
  displayAuthor,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [filters, setFilters] = useState<ProjectFilters>({ name: '', authors: [], supervisors: [] });
  const [deleteProjectAlert, setDeleteProjectAlert] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  const { data: meData } = useMeQuery();
  if (!displayAuthor) filters.authors = [parseInt(meData?.me?.user?.id ?? '0')];
  const { data, loading } = useProjectsQuery({ variables: { userId, ...filters } });

  const [deleteProject, { error, client }] = useDeleteProjectMutation({
    update() {
      client?.resetStore();
    }
  });

  const canDeleteProject = meData?.me && hasPermissions(meData.me, 'projects.manage');

  const handleAlertOpen = () => setDeleteProjectAlert(true);
  const handleDeleteAlertClose = () => setDeleteProjectAlert(false);

  if (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }

  const handleDeleteProject = async (id: number) => {
    await deleteProject({
      variables: { projectId: id }
    });
    enqueueSnackbar('Project successfully deleted', { variant: 'success' });
  };

  if (loading) return <span>Loading...</span>;

  return (
    <div>
      <ProjectsFilter
        defaultValues={filters}
        filterAuthor={displayAuthor}
        onSubmit={(filter) => {
          setFilters(filter);
        }}
      />
      <h2>Projects List</h2>
      <Paper>
        <PaperStyles>
          <List>
            <div className="flex">
              <Item>
                <div>Basic info</div>
              </Item>
              {displayAuthor &&
                <Item>
                  <div>Author</div>
                </Item>
              }
              <Item>
                <div>Supervisor</div>
              </Item>
              <Item className="description">
                <div>Description</div>
              </Item>
              <Item>
                <div>Action</div>
              </Item>
            </div>
            {data &&
              data.projects &&
              data.projects.map(project => (
                <div key={project.id} className="flex">
                  <Item>
                    <div>{project.name}</div>
                  </Item>
                  {displayAuthor &&
                    <Item>
                      <div>
                        <UserLink id={parseInt(project.user.id)} name={project.user.name} />
                      </div>
                    </Item>
                  }
                  <Item>
                    <div>
                      {project.supervisor && <UserLink id={parseInt(project.supervisor.id)} name={project.supervisor.name} />}
                    </div>
                  </Item>
                  <Item className="description">
                    <div>{project.description.slice(0, 100)}{!project.description || project.description.length > 100 ? '...' : ''}</div>
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
                    {(canDeleteProject || project.user.id === meData?.me?.user?.id) &&
                      <Fab
                        color="secondary"
                        variant="extended"
                        onClick={() => {
                          setProjectId(parseInt(project.id));
                          handleAlertOpen();
                        }}
                      >
                        X
                      </Fab>
                    }
                  </Item>
                </div>
              ))}
          </List>
        </PaperStyles>
      </Paper>
      <DeleteProjectAlert
        open={deleteProjectAlert}
        handleClose={handleDeleteAlertClose}
        handleDeleteProject={handleDeleteProject}
        projectId={projectId}
      />
    </div>
  );
};

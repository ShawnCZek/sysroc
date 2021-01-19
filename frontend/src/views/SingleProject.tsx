import moment from 'moment';
import styled from 'styled-components';
import React, { useState } from 'react';
import { ClassificationDto, ProjectDto, useProjectDetailsQuery, useProjectQuery } from '../generated/graphql';
import { RouteComponentProps, useHistory } from 'react-router';
import { Fab, Typography } from '@material-ui/core';
import { TasksList } from '../components/Task/TasksList';
import { CreateTaskModal } from '../components/Task/CreateTaskModal';
import { ITask } from '../components/Task/Task';
import { UpdateTaskModal } from '../components/Task/UpdateTaskModal';
import { ClaimProjectFab } from '../components/Project/ClaimProjectFab';
import { useHasPermissions } from '../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../generated/permissions';
import { InviteButton } from '../components/Invitation/InviteButton';
import { ComponentLoading } from '../components/ComponentLoading';
import { UpdateProjectButton } from '../components/Project/UpdateProjectButton';
import { ProjectClassificationFab } from '../components/Project/ProjectClassificationFab';

const ProjectControls = styled.div`
  display: flex;
  margin-bottom: 2rem;

  button {
    width: auto;
    margin: 0 .8rem;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Project = styled.div`
  h4,
  h5 {
    text-align: center;
    margin-bottom: 2rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  .add-task-btn {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: stretch;
    margin: 1rem 0;
  }
`;

const TaskLists = styled.div`
  max-width: 100%;
  display: grid;
  grid-template-columns: minmax(25rem, 1fr) minmax(25rem, 1fr);
  grid-gap: 4rem;
  margin: 3rem auto;
`;

interface Props extends RouteComponentProps<{
  projectId: string;
}> {}

export const SingleProject: React.FC<Props> = props => {
  const projectId = parseInt(props.match.params.projectId);

  const history = useHistory();

  const [upTaskModalOpen, setUpTaskModalOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);

  const { data, loading } = useProjectQuery({ variables: { id: projectId } });
  const { data: details, loading: detailsLoading } = useProjectDetailsQuery({ variables: { id: projectId } });

  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);
  const canManageProject = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  const handleCreateTaskOpen = () => setCreateTaskOpen(true);
  const handleCreateTaskClose = () => setCreateTaskOpen(false);

  const handleUpTaskModalOpen = () => setUpTaskModalOpen(true);
  const handleUpTaskModalClose = () => {
    setUpTaskModalOpen(false);
    setSelectedTaskId(0);
  };

  const tasks: ITask[] = data?.project.tasks ? data.project.tasks.slice() : [];
  tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const tasksByMonth: { [key: string]: ITask[] } = {};
  for (const task of tasks) {
    const key: string = moment(task.dueDate).format('MMMM YYYY');
    if (tasksByMonth[key] === undefined) {
      tasksByMonth[key] = [];
    }

    tasksByMonth[key].push(task);
  }

  if (loading || detailsLoading) return <ComponentLoading />;

  return (
    <>
      <ProjectControls>
        <Actions>
          <Fab
            color="primary"
            variant="extended"
            onClick={() => {
              history.goBack();
            }}
          >
            Back
          </Fab>
          { data?.project && <UpdateProjectButton project={data.project as ProjectDto} /> }
          { data?.project && <InviteButton projectId={parseInt(data.project.id)} /> }
          { data?.project &&
            <ProjectClassificationFab
              projectId={parseInt(data.project.id)}
              classification={data.project.classifications as ClassificationDto[]}
            />
          }
          { data?.project &&
            <ClaimProjectFab
              projectId={parseInt(data.project.id)}
              hasSupervisor={data.project.supervisor !== null}
              supervisorId={data.project.supervisor ? parseInt(data.project.supervisor.id) : null}
            />
          }
        </Actions>
      </ProjectControls>
      {data ? (
        <Project>
          <Typography variant="h4">{data.project.name}</Typography>
          <Typography variant="h5">{data.project.description}</Typography>
          { (canManageProject || (canManageOwnProject && details?.projectDetails.isAuthor)) &&
            <div className="add-task-btn">
              <Fab
                color="secondary"
                variant="extended"
                onClick={handleCreateTaskOpen}
              >
                Add Task
              </Fab>
            </div>
          }
          {data.project.tasks ? (
            <TaskLists>
              {Object.keys(tasksByMonth).map(key => (
                <TasksList
                  key={key}
                  tasks={tasksByMonth[key]}
                  date={key}
                  project={parseInt(data.project.id)}
                  handleUpdateModalOpen={handleUpTaskModalOpen}
                  selectTask={setSelectedTaskId}
                />
              ))}
            </TaskLists>
          ) : (
            <div>You have no tasks</div>
          )}
        </Project>
      ) : (
        <div>There is no project with ID {projectId}</div>
      )}
      <CreateTaskModal
        open={createTaskOpen}
        handleClose={handleCreateTaskClose}
        project={parseInt(data?.project.id ?? '0')}
      />
      {selectedTaskId !== 0 &&
        <UpdateTaskModal
          open={upTaskModalOpen}
          handleClose={handleUpTaskModalClose}
          task={selectedTaskId}
          projectId={parseInt(data?.project.id ?? '0')}
        />
      }
    </>
  );
};

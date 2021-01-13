import moment from 'moment';
import styled from 'styled-components';
import React, { useState } from 'react';
import { ClassificationDto, ProjectDto, useMeQuery, useProjectQuery } from '../generated/graphql';
import { RouteComponentProps, useHistory } from 'react-router';
import { Fab, Typography } from '@material-ui/core';
import { UpdateProjectModal } from '../components/Project/UpdateProjectModal';
import { TasksList } from '../components/Task/TasksList';
import { CreateTaskModal } from '../components/Task/CreateTaskModal';
import { ITask } from '../components/Task/Task';
import { UpdateTaskModal } from '../components/Task/UpdateTaskModal';
import { ProjectClassificationOverview } from '../components/Project/ProjectClassificationOverview';
import { ClaimProjectFab } from '../components/Project/ClaimProjectFab';
import { useHasPermissions } from '../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../generated/permissions';
import { InviteButton } from '../components/Invitation/InviteButton';
import { ComponentLoading } from '../components/ComponentLoading';

const ProjectControls = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 40rem 1fr 1fr;

  margin-bottom: 2rem;

  button {
    width: auto;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  grid-column: 1 / 1;
  grid-row: 1 / 1;
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
    padding-right: 5rem;
  }
`;

const TaskLists = styled.div`
  max-width: 100%;
  display: grid;
  grid-template-columns: minmax(25rem, 1fr) minmax(25rem, 1fr);
  grid-gap: 4rem;
  margin: 3rem auto;
`;

interface Props
  extends RouteComponentProps<{
    projectId: string;
  }> {}

export const SingleProject: React.FC<Props> = props => {
  const history = useHistory();

  const [modalOpen, setModalOpen] = useState(false);
  const [classOverviewOpen, setClassOverviewOpen] = useState(false);
  const [upTaskModalOpen, setUpTaskModalOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);

  const { data: meData, loading: meLoading } = useMeQuery();
  const { data, loading } = useProjectQuery({
    variables: { id: parseInt(props.match.params.projectId) }
  });

  const isAuthor = data?.project?.users?.some(author => author.id === meData?.me?.user?.id);
  const canManageOwnProject = useHasPermissions(PERMISSIONS.PROJECTS_CREATE);
  const canManageProject = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleCreateTaskOpen = () => setCreateTaskOpen(true);
  const handleCreateTaskClose = () => setCreateTaskOpen(false);

  const handleUpTaskModalOpen = () => setUpTaskModalOpen(true);
  const handleUpTaskModalClose = () => {
    setUpTaskModalOpen(false);
    setSelectedTaskId(0);
  };

  const handleClassOverviewClose = () => setClassOverviewOpen(false);

  const tasksByMonth: { [key: string]: ITask[] } = {};
  for (const task of data?.project.tasks ?? []) {
    const key: string = moment(task.dueDate).format('MM. YYYY');
    if (tasksByMonth[key] === undefined) {
      tasksByMonth[key] = [];
    }

    tasksByMonth[key].push(task);
  }

  if (loading || meLoading) return <ComponentLoading />;

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
          { (canManageProject || isAuthor) ? (
            <>
              { (canManageProject || (canManageOwnProject && isAuthor)) &&
                <Fab
                  color="secondary"
                  variant="extended"
                  onClick={() => {
                    handleModalOpen();
                  }}
                >
                  Edit
                </Fab>
              }
              { canManageOwnProject && isAuthor && data?.project &&
                <InviteButton projectId={parseInt(data.project.id)} />
              }

              <Fab
                color="primary"
                variant="extended"
                onClick={() => {
                  setClassOverviewOpen(true);
                }}
              >
                Classification
              </Fab>
            </>
          ) : (
            <>
              <div />
              <div />
              <div />
            </>
          )}
          { data && (
            <ClaimProjectFab
              projectId={parseInt(data.project.id)}
              hasSupervisor={data.project.supervisor !== null}
              supervisorId={data?.project.supervisor ? parseInt(data.project.supervisor.id) : null}
            />
          )}
        </Actions>
      </ProjectControls>
      {data ? (
        <Project>
          <Typography variant="h4">{data.project.name}</Typography>
          <Typography variant="h5">{data.project.description}</Typography>
          { (canManageProject || (canManageOwnProject && isAuthor)) &&
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
        <div>There is no project with ID {props.match.params.projectId}</div>
      )}
      {data && (
          <>
            <UpdateProjectModal
              open={modalOpen}
              handleClose={handleModalClose}
              projectId={parseInt(props.match.params.projectId)}
              data={data?.project as ProjectDto}
            />
            <ProjectClassificationOverview
              open={classOverviewOpen}
              handleClose={handleClassOverviewClose}
              classification={data?.project.classifications as ClassificationDto[]}
            />
          </>
      )}
      { data && (canManageProject || (canManageOwnProject && isAuthor)) && (
        <UpdateProjectModal
          open={modalOpen}
          handleClose={handleModalClose}
          projectId={parseInt(props.match.params.projectId)}
          data={data?.project as ProjectDto}
        />
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

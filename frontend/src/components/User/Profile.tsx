import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useProjectsQuery, useUserQuery } from '../../generated/graphql';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';
import { ProjectsTable } from '../Project/ProjectsTable';
import { ComponentLoading } from '../ComponentLoading';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';
import { NewProjectFab } from '../Project/NewProjectFab';

const UserInformation = styled.div`
  & p {
    font-size: .9rem;
  }
`;

const PersonalInformation = styled.div`
  margin-top: 1rem;
`;

interface Props {
  userId: number;
  forceEmail?: boolean;
  projectsCreate?: boolean;
}

export const Profile: React.FC<Props> = ({
  userId,
  forceEmail,
  projectsCreate,
}) => {
  const { data, loading } = useUserQuery({ variables: { id: userId } });
  const { data: projectsData, loading: projectsLoading } = useProjectsQuery({ variables: { authors: [userId] } });

  const canViewEmail = useHasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS);
  const canViewGroups = useHasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS);

  if (loading || projectsLoading) return <ComponentLoading />;

  return (
    <>
      <UserInformation>
        { data?.user?.roles && data.user.roles.length > 0 &&
          <Typography><strong>Roles:</strong> {data.user.roles.map(role => role.name).join(', ')}</Typography>
        }
        { canViewGroups && data?.user?.groups && data.user.groups.length > 0 &&
          <Typography><strong>Active Directory Groups:</strong> {data.user.groups.map(group => group.name).join(', ')}</Typography>
        }
        { (forceEmail || canViewEmail) &&
          <PersonalInformation>
            <Typography><strong>Active Directory email:</strong> {data?.user?.adEmail}</Typography>
            <Typography><strong>Custom email:</strong> {data?.user?.email}</Typography>
          </PersonalInformation>
        }
      </UserInformation>
      <PageHeader>
        <PageHeaderContent>
          <h2>Projects List</h2>
        </PageHeaderContent>
        <PageHeaderActions>
          { (projectsCreate ?? false) && <NewProjectFab /> }
        </PageHeaderActions>
      </PageHeader>
      { projectsData?.projects && <ProjectsTable projects={projectsData.projects} /> }
    </>
  );
};

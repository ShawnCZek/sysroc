import React from 'react';
import { PERMISSIONS } from '../generated/permissions';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SignIn } from '../components/SignIn';
import { Home } from '../components/Home';
import { SignUp } from '../components/SignUp';
import { PasswordReset } from '../components/PasswordReset/PasswordReset';
import { ChangePassword } from '../components/PasswordReset/ChangePassword';
import { PersistentDrawerLeft } from '../components/PersisstentDrawerLeft';
import { Projects } from '../views/Projects';
import { SingleProject } from '../views/SingleProject';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useMeQuery, useMyPermissionsQuery } from '../generated/graphql';
import { NotAllowed } from '../views/NotAllowed';
import { Users } from '../views/Users';
import { Settings } from '../views/Settings';
import { Classification } from '../views/Classification';
import { SingleUser } from '../views/SingleUser';
import { Roles } from '../views/Roles';
import { Groups } from '../views/Groups';
import { hasPermissions } from '../auth/hasPermissions';
import { isAdmin } from '../auth/roles';

export const Routes: React.FC = () => {
  const { data, loading } = useMeQuery();
  const { data: permissionData, loading: permissionLoading } = useMyPermissionsQuery();

  if (loading || permissionLoading) return <div>Loading...</div>;

  const projectList = hasPermissions(permissionData?.myPermissions, PERMISSIONS.PROJECTS_CREATE, PERMISSIONS.PROJECTS_VIEW, PERMISSIONS.PROJECTS_MANAGE);
  const userList = hasPermissions(permissionData?.myPermissions, PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS);
  const classificationList = hasPermissions(permissionData?.myPermissions, PERMISSIONS.CLASSIFICATION_VIEW);
  const groupsList = hasPermissions(permissionData?.myPermissions, PERMISSIONS.GROUP_MANAGE);
  const manageRoles = isAdmin(data?.me?.user);

  return (
    <BrowserRouter>
      <div>
        <PersistentDrawerLeft>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/password-reset" component={PasswordReset} />
            <Route exact path="/password-reset/:hash" component={ChangePassword} />
            <Route exact path="/notallowed" component={NotAllowed} />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={projectList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/projects"
              component={Projects}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={projectList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/projects/:projectId"
              component={SingleProject}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={userList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/users"
              component={Users}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={true}
              restrictedPath={''}
              authenticationPath={'/signin'}
              exact
              path="/users/:userId"
              component={SingleUser}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={true}
              restrictedPath={''}
              authenticationPath={'/signin'}
              exact
              path="/settings"
              component={Settings}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={classificationList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/classification"
              component={Classification}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={manageRoles}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/roles"
              component={Roles}
            />
            <ProtectedRoute
              isAuthenticated={!!data?.me}
              isAllowed={groupsList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/groups"
              component={Groups}
            />
          </Switch>
        </PersistentDrawerLeft>
      </div>
    </BrowserRouter>
  );
};

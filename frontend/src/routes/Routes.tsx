import React from 'react';
import { PERMISSIONS } from '../generated/permissions';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Loading } from '../components/Loading';
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
import { AcceptInvitation } from '../views/AcceptInvitation';
import { hasPermissions } from '../auth/hasPermissions';
import { isAdmin } from '../auth/roles';

export const Routes: React.FC = () => {
  const { data, loading } = useMeQuery();
  const { data: permissionData, loading: permissionLoading } = useMyPermissionsQuery();

  if (loading || permissionLoading) return <Loading />;

  const authenticated = !!data?.me;
  const projectList = hasPermissions(permissionData?.myPermissions, PERMISSIONS.PROJECTS_CREATE, PERMISSIONS.PROJECTS_VIEW);
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
              isAuthenticated={authenticated}
              isAllowed={projectList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/projects"
              component={Projects}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              authenticationPath={'/signin'}
              exact
              path="/projects/:projectId"
              component={SingleProject}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              authenticationPath={'/signin'}
              exact
              path="/invitations/:invitationId"
              component={AcceptInvitation}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              isAllowed={userList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/users"
              component={Users}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              isAllowed={true}
              restrictedPath={''}
              authenticationPath={'/signin'}
              exact
              path="/users/:userId"
              component={SingleUser}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              isAllowed={true}
              restrictedPath={''}
              authenticationPath={'/signin'}
              exact
              path="/settings"
              component={Settings}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              isAllowed={classificationList}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/classification"
              component={Classification}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
              isAllowed={manageRoles}
              restrictedPath={'/notallowed'}
              authenticationPath={'/signin'}
              exact
              path="/roles"
              component={Roles}
            />
            <ProtectedRoute
              isAuthenticated={authenticated}
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

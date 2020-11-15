import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SignIn } from '../components/SignIn';
import { Home } from '../components/Home';
import { SignUp } from '../components/SignUp';
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
import { hasPermissions } from '../auth/hasPermissions';

export const Routes: React.FC = () => {
  const { data, loading } = useMeQuery();
  const { data: permissionData, loading: permissionLoading } = useMyPermissionsQuery();

  if (loading || permissionLoading) return <div>Loading...</div>;

  const projectList = hasPermissions(permissionData?.myPermissions, 'projects.create', 'projects.view', 'projects.manage');
  const userList = hasPermissions(permissionData?.myPermissions, 'users.students.manage', 'users.teachers.manage');
  const classificationList = hasPermissions(permissionData?.myPermissions, 'classification.view');

  return (
    <BrowserRouter>
      <div>
        <PersistentDrawerLeft>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
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
          </Switch>
        </PersistentDrawerLeft>
      </div>
    </BrowserRouter>
  );
};

import React from 'react';
import { useRolesQuery } from '../../generated/graphql';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';

interface Props {
  admin: boolean;
  userRoles?: string[];
  onRolesStateChange: (roles: string[]) => void;
}

export const UserRoles: React.FC<Props> = ({
  admin,
  userRoles,
  onRolesStateChange,
}) => {
  const [roles, setRoles] = React.useState(userRoles ? userRoles : ['guest']);

  const { data: rolesData, loading: rolesLoading } = useRolesQuery({ variables: { admin } });

  const canManageTeachers = useHasPermissions('users.teachers.manage');
  const canManageStudents = useHasPermissions('users.students.manage');

  const handleRoleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let newRoles: string[];

    if (!event.target.checked) {
      newRoles = roles.filter(role => role !== name);
    } else {
      newRoles = [ ...roles, name ];
    }

    setRoles(newRoles);
    onRolesStateChange(newRoles);
  };

  if (rolesLoading) return <span>Loading...</span>;

  return (
    <FormGroup>
      { rolesData &&
        rolesData.roles &&
        rolesData.roles.filter(role => (role.slug !== 'teacher' || canManageTeachers) && (role.slug !== 'student' || canManageStudents)).map(role => (
        <FormControlLabel
          key={role.id}
          control={
            <Checkbox
              checked={roles.includes(role.slug)}
              onChange={handleRoleChange(role.slug)}
              value={role.slug}
              color="primary"
            />
          }
          label={role.name}
        />
      ))}
    </FormGroup>
  );
};

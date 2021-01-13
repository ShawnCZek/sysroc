import React from 'react';
import { useRolesQuery } from '../../generated/graphql';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { ComponentLoading } from '../ComponentLoading';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

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

  const canManageTeachers = useHasPermissions(PERMISSIONS.MANAGE_TEACHER_USERS);
  const canManageStudents = useHasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS);

  const handleRoleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let newRoles: string[];

    if (!event.target.checked) {
      newRoles = roles.filter(role => role !== name);
    } else {
      newRoles = [...roles, name];
    }

    setRoles(newRoles);
    onRolesStateChange(newRoles);
  };

  if (rolesLoading) return <ComponentLoading />;

  return (
    <FormGroup>
      { rolesData?.roles &&
        rolesData.roles.filter(role => (!role.teacher || canManageTeachers) && (!role.student || canManageStudents)).map(role => (
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

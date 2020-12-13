import React from 'react';
import { usePermissionsQuery } from '../../generated/graphql';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';

interface Props {
  rolePermissions?: string[];
  onPermissionsStateChange: (permissions: string[]) => void;
}

export const RolePermissions: React.FC<Props> = ({
  rolePermissions,
  onPermissionsStateChange,
}) => {
  const [permissions, setPermissions] = React.useState<string[]>(rolePermissions ?? []);

  const { data, loading } = usePermissionsQuery();

  const handlePermissionChange = (slug: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    let newPermissions: string[];

    if (!event.target.checked) {
      newPermissions = permissions.filter(permission => permission !== slug);
    } else {
      newPermissions = [...permissions, slug];
    }

    setPermissions(newPermissions);
    onPermissionsStateChange(newPermissions);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <FormGroup>
      { data?.permissions && data.permissions.map(permission => (
        <FormControlLabel
          key={permission.id}
          control={
            <Checkbox
              checked={permissions.includes(permission.slug)}
              onChange={handlePermissionChange(permission.slug)}
              value={permission.slug}
              color="primary"
            />
          }
          label={permission.name}
        />
      )) }
    </FormGroup>
  );
};

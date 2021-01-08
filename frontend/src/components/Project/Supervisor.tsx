import React from 'react';
import styled from 'styled-components';
import { makeStyles, TextField } from '@material-ui/core';
import { useBaseUsersQuery, useRolesQuery } from '../../generated/graphql';
import { Autocomplete } from '@material-ui/lab';

const SupervisorStyles = styled.div`
  padding: .5rem 0 1rem 0;
`;

const useStyles = makeStyles({
  field: {
    width: '28rem'
  }
});

interface Props {
  defaultValue?: string | null;
  onSupervisorStateChange: (supervisor: number | null) => void;
}

export const Supervisor: React.FC<Props> = ({
  defaultValue,
  onSupervisorStateChange,
}) => {
  const classes = useStyles();
  const [loaded, setLoaded] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const { data: rolesData, loading: rolesLoading } = useRolesQuery({ variables: { permission: "projects.claim" } });
  const { data: usersData, loading: usersLoading } = useBaseUsersQuery({ variables: { roles: rolesData?.roles.map(role => parseInt(role.id)) } });

  const handleChange = (event: React.ChangeEvent<{}>, value: any) => {
    setValue(value);
    updateSupervisor(value);
  };

  const updateSupervisor = (value: any) => {
    if (usersData?.baseUsers) {
      onSupervisorStateChange(value ? parseInt(usersData.baseUsers.filter(user => user.name === value)[0].id) : null);
    }
  };

  if (rolesLoading || usersLoading) return <span>Loading...</span>;

  if (!loaded) {
    // A little hack to get rid of console errors with not using the default value
    updateSupervisor(defaultValue);
    setLoaded(true);
  }

  return (
    <SupervisorStyles>
      {usersData?.baseUsers &&
        <Autocomplete
          placeholder="Supervisor"
          options={usersData.baseUsers.map(user => user.name)}
          value={value}
          onChange={handleChange}
          renderInput={params => (
            <TextField
              {...params}
              label="Supervisor"
              variant="standard"
              className={classes.field}
            />
          )}
        />
      }
    </SupervisorStyles>
  );
};

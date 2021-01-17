import React from 'react';
import styled from 'styled-components';
import { makeStyles, TextField } from '@material-ui/core';
import { useBaseUsersQuery } from '../../generated/graphql';
import { Autocomplete } from '@material-ui/lab';
import { ComponentLoading } from '../ComponentLoading';
import { PERMISSIONS } from '../../generated/permissions';

const SupervisorStyles = styled.div`
  padding: .5rem 0 1rem 0;
`;

const useStyles = makeStyles({
  field: {
    width: '28rem',
  },
});

interface Props {
  defaultValue?: string | null;
  onSupervisorStateChange: (supervisor: number | null) => void;
}

export const Supervisor: React.FC<Props> = ({ defaultValue, onSupervisorStateChange }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultValue);

  const { data, loading } = useBaseUsersQuery({ variables: { permissions: [PERMISSIONS.PROJECTS_CLAIM] } });

  const handleChange = (event: React.ChangeEvent<{}>, value: any) => {
    setValue(value);
    if (data?.baseUsers) {
      onSupervisorStateChange(value ? parseInt(data.baseUsers.find(user => user.name === value)!.id) : null);
    }
  };

  if (loading) return <ComponentLoading/>;

  return (
    <SupervisorStyles>
      <Autocomplete
        placeholder="Supervisor"
        options={data?.baseUsers ? data.baseUsers.map(user => user.name) : []}
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
    </SupervisorStyles>
  );
};

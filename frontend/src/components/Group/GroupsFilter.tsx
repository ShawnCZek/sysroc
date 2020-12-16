import React from 'react';
import { GroupFilter, useGroupsQuery } from '../../generated/graphql';
import { Form, Formik } from 'formik';
import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '12rem',
  },
  textField: {
    marginRight: '1rem',
  },
  autoComplete: {
    width: '20rem',
  },
  autoCompleteField: {
    width: '100%',
  },
}));

interface Props {
  defaultValues: GroupFilter;
  onSubmit: (filter: GroupFilter) => void;
}

export const GroupsFilter: React.FC<Props> = ({
  defaultValues,
  onSubmit,
}) => {
  const classes = useStyles();

  const [name, setName] = React.useState(defaultValues.name);
  const [order, setOrder] = React.useState(defaultValues.order);

  const { data, loading } = useGroupsQuery();

  if (loading) return <div>Loading...</div>;

  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={values => {
        onSubmit({ ...values, order, name });
      }}
    >
      <Form className={classes.form}>
        <Autocomplete
          freeSolo
          placeholder="Name"
          options={data?.groups.map(group => group.name) as string[]}
          className={classes.autoComplete}
          onChange={(event, value) => setName(value)}
          value={name}
          renderInput={params => (
            <TextField
              {...params}
              label="Name"
              className={classes.autoCompleteField}
              variant="standard"
              onChange={event => setName(event.target.value)}
            />
          )}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="groups-filter-order-label">Order</InputLabel>
          <Select
            labelId="groups-filter-order-label"
            id="groups-filter-order"
            value={order}
            onChange={event => setOrder(event.target.value as string)}
            autoWidth
          >
            <MenuItem value="name_asc">Name - Ascending</MenuItem>
            <MenuItem value="name_desc">Name - Descending</MenuItem>
            <MenuItem value="users_asc">Users - Ascending</MenuItem>
            <MenuItem value="users_desc">Users - Descending</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Filter
        </Button>
      </Form>
    </Formik>
  );
};

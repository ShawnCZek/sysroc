import React from 'react';
import { Form, Formik } from 'formik';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { ApolloError } from '@apollo/client';
import { useBaseUsersQuery } from '../../generated/graphql';
import { Error } from '../Error';
import { Autocomplete } from '@material-ui/lab';
import { ComponentLoading } from '../ComponentLoading';

const useStyles = makeStyles({
  form: {
    padding: '0.2rem',
    margin: '0 auto',
    marginTop: '1.3rem',
  },
  button: {
    marginTop: '2rem',
  },
  formTitle: {
    marginBottom: '0.8rem',
  },
  field: {
    maxWidth: '18rem',
  },
});

interface Props {
  onSubmit: (userId: number) => void;
  error: ApolloError | any;
}

export const InviteForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();

  const { data, loading } = useBaseUsersQuery({ variables: { student: true } });

  let userId: string;
  const handleUserChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (data && data.baseUsers) {
      const user = data.baseUsers.find(user => user.name === value);
      if (user) userId = user.id;
    }
  };

  if (loading) return <ComponentLoading />;

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        onSubmit(parseInt(userId));
      }}
    >
      <Form className={classes.form}>
        {error && <Error error={error} />}
        <Autocomplete
          placeholder="User"
          options={data?.baseUsers?.map(user => user.name) as string[]}
          onChange={handleUserChange}
          className={classes.field}
          renderInput={params => (
            <TextField
              {...params}
              label="User"
              variant="standard"
            />
          )}
        />
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Invite
        </Button>
      </Form>
    </Formik>
  );
};

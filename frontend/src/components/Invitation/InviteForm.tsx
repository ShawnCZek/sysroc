import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, makeStyles } from '@material-ui/core';
import { ApolloError } from '@apollo/client';
import { Error } from '../Error';
import { MyField } from '../MyField';

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
    width: '100%',
    maxWidth: '16rem',
  },
});

interface Props {
  onSubmit: (email: string) => void;
  error: ApolloError | any;
}

export const InviteForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={values => {
        onSubmit(values.email);
      }}
    >
      <Form className={classes.form}>
        {error && <Error error={error} />}
        <div>
          <Field
            name="email"
            type="email"
            placeholder="User's Email"
            label="User's Email"
            className={classes.field}
            component={MyField}
            required
          />
        </div>
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

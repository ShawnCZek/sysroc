import React from 'react';
import { Field, Form, Formik } from 'formik';
import { ApolloError } from '@apollo/client';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Error } from '../Error';
import { MyField } from '../MyField';

const useStyles = makeStyles({
  form: {
    padding: '2rem',
    width: '30rem',
    margin: '0 auto',
    marginTop: '1.3rem'
  },
  button: {
    marginTop: '1rem'
  },
  formTitle: {
    marginBottom: '0.8rem'
  }
});

interface Values {
  password: string;
  passwordAgain: string;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
}

export const ChangePasswordForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ password: '', passwordAgain: '' }}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      <Form className={classes.form}>
        <Typography className={classes.formTitle} variant="h4">
          Change Password
        </Typography>
        <Typography>
          Change your account password here.
        </Typography>
        {error && <Error error={error} />}
        <div>
          <Field
            type="password"
            name="password"
            placeholder="New Password"
            label="New Password"
            component={MyField}
            required
          />
        </div>
        <div>
          <Field
            type="password"
            name="passwordAgain"
            placeholder="New Password Again"
            label="New Password Again"
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
          Change
        </Button>
      </Form>
    </Formik>
  );
};

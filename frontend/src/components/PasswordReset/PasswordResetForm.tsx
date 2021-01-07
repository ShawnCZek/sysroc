import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { MyField } from '../MyField';
import { ApolloError } from '@apollo/client';
import { Error } from '../Error';

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
  email: string;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
}

export const PasswordResetForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      <Form className={classes.form}>
        <Typography className={classes.formTitle} variant="h4">
          Password Reset
        </Typography>
        <Typography>
          Please enter your email address here. If the address is correct and we have it in our database,
          you will receive a message with further instructions.
        </Typography>
        {error && <Error error={error} />}
        <div>
          <Field
            name="email"
            type="email"
            placeholder="Email Address"
            label="Email Address"
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
          Send
        </Button>
      </Form>
    </Formik>
  );
};

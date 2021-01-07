import React from 'react';
import { Box, Button, Link, makeStyles, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { MyField } from './MyField';
import { ApolloError } from '@apollo/client';
import { Error } from './Error';
import { useHistory } from 'react-router';

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
  },
  box: {
    marginTop: '2rem'
  }
});

interface Values {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
}

export const SignInForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      {() => (
        <Form className={classes.form}>
          <Typography className={classes.formTitle} variant="h4">
            Sign In
          </Typography>
          {error && <Error error={error} />}
          <div>
            <Field
              name="email"
              type="text"
              placeholder="Email Address"
              label="Email Address"
              component={MyField}
              required
            />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              label="Password"
              component={MyField}
            />
          </div>
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Box className={classes.box}>
            <Typography>
              <Link
                href={'/password-reset'}
                onClick={(event: any) => {
                  event.preventDefault();
                  history.push('/password-reset');
                }}
              >
                Forgot your password?
              </Link>
            </Typography>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

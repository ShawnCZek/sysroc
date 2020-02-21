import React from 'react';
import { Button, Checkbox, FormControlLabel, makeStyles, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { MyField } from '../MyField';
import { ApolloError } from 'apollo-client';
import { Error } from '../Error';
import { useMeExtendedQuery, useRolesQuery } from '../../generated/graphql';
import { hasPermissions } from '../../auth/hasPermissions';

const useStyles = makeStyles({
  form: {
    margin: '0 auto'
  },
  formControl: {
    marginTop: '0.5rem'
  },
  button: {
    marginTop: '1rem'
  },
  formTitle: {
    marginTop: '1.5rem'
  },
  formNote: {
    marginBottom: '0.5rem'
  }
});

interface Values {
  name: string;
  email: string;
  adEmail?: string;
  password?: string;
  roles?: string[];
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
}

export const NewUserForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles({});
  const [roles, setRoles] = React.useState(['guest']);
  const { data, loading } = useRolesQuery({ variables: { admin: false } });
  const { data: dataMe } = useMeExtendedQuery();
  const canManageTeachers = (dataMe && dataMe.me && hasPermissions(dataMe.me, 'users.teachers.manage'));
  const canManageStudents = (dataMe && dataMe.me && hasPermissions(dataMe.me, 'users.students.manage'));

  const handleRoleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setRoles(roles.filter(role => role !== name));
    } else {
      setRoles([ ...roles, name ]);
    }
  };

  if (loading) return <span>Loading...</span>;

  return (
    <Formik
      initialValues={{ name: '', email: '', adEmail: '', password: '' }}
      onSubmit={values => {
        onSubmit({ ...values, roles });
      }}
    >
      {() => (
        <Form className={classes.form}>
          {error && <Error error={error} />}
          <div>
            <Field
              name="name"
              type="text"
              placeholder="User Name"
              label="User Name"
              component={MyField}
              required
            />
          </div>
          <div>
            <Field
              name="email"
              type="email"
              placeholder="Email"
              label="Email"
              component={MyField}
              required
            />
          </div>
          <Typography className={classes.formTitle} variant="h6">
            Roles
          </Typography>
          { data &&
            data.roles &&
            data.roles.filter(role => (role.slug !== 'teacher' || canManageTeachers) && (role.slug !== 'student' || canManageStudents)).map(role => (
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
          <Typography className={classes.formTitle} variant="h5">
            Active Directory Credentials
          </Typography>
          <p className={classes.formNote}>
            Fill details below to connect the user account with Active Directory.
          </p>
          <div>
            <Field
              name="adEmail"
              type="text"
              placeholder="Active Directory Email"
              label="Active Directory Email"
              component={MyField}
            />
          </div>
          <div>
            <Field
              name="password"
              type="password"
              placeholder="Active Directory Password"
              label="Active Directory Password"
              component={MyField}
            />
          </div>
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};

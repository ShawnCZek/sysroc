import React from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, makeStyles, Typography } from '@material-ui/core';
import { ApolloError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import { Error } from '../Error';
import { MyField } from '../MyField';
import { RolePermissions } from './RolePermissions';

const useStyles = makeStyles({
  form: {
    margin: '0 auto'
  },
  formControl: {
    marginTop: '1rem'
  },
  button: {
    marginTop: '1rem'
  },
  formTitle: {
    marginTop: '1.5rem'
  },
});

interface Values {
  name: string;
  admin: boolean;
  student: boolean;
  teacher: boolean;
  permissions: string[];
}

interface Props {
  onSubmit: (values: Values) => void;
  roleData: Values;
  error: ApolloError | any;
}

export const RoleForm: React.FC<Props> = ({
  onSubmit,
  roleData,
  error,
}) => {
  const classes = useStyles();

  const [teacher, setTeacher] = React.useState(roleData.teacher);
  const [student, setStudent] = React.useState(roleData.student);
  const [permissions, setPermissions] = React.useState(roleData.permissions);

  const handleRoleChange = (permissionSlugs: string[]): void => setPermissions(permissionSlugs);

  return (
    <Formik
      initialValues={roleData}
      onSubmit={values => {
        onSubmit({ name: values.name, admin: false, teacher, student, permissions });
      }}
    >
      <Form className={classes.form}>
        {error && <Error error={error} />}
        <div>
          <Field
            name="name"
            type="text"
            placeholder="Name"
            label="Name"
            component={MyField}
            required
          />
        </div>
        <FormGroup className={classes.formControl}>
          <FormControlLabel
            key="admin"
            disabled={true}
            control={
              <Checkbox
                checked={roleData.admin}
                value="admin"
                color="primary"
              />
            }
            label="Administrator"
          />
          <FormControlLabel
            key="teacher"
            control={
              <Checkbox
                checked={teacher}
                onChange={event => setTeacher(event.target.checked)}
                value="teacher"
                color="primary"
              />
            }
            label="Teacher"
          />
          <FormControlLabel
            key="student"
            control={
              <Checkbox
                checked={student}
                onChange={event => setStudent(event.target.checked)}
                value="student"
                color="primary"
              />
            }
            label="Student"
          />
        </FormGroup>
        { !roleData.admin &&
          <>
            <Typography className={classes.formTitle} variant="h6">
              Permissions
            </Typography>
            <RolePermissions
              rolePermissions={permissions}
              onPermissionsStateChange={handleRoleChange}
            />
          </>
          }
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </Form>
    </Formik>
  );
};

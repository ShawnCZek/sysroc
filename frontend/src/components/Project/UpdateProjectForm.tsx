import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { MyField } from '../MyField';
import { Error } from '../Error';
import { Supervisor } from './Supervisor';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';
import { ProjectDto } from '../../generated/graphql';
import { ApolloError } from '@apollo/client';

const useStyles = makeStyles({
  form: {
    padding: '1rem 2rem 2rem',
    margin: '0 auto',
    marginTop: '1.3rem'
  },
  button: {
    marginTop: '1rem'
  },
  formTitle: {
    marginBottom: '0.8rem'
  },
  field: {
    width: '28rem'
  }
});

interface Values {
  name: string;
  description: string;
  supervisor: number | null;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
  data: ProjectDto;
}

export const UpdateProjectForm: React.FC<Props> = ({
  onSubmit,
  error,
  data
}) => {
  const classes = useStyles();
  const canManageProjectSupervisor = useHasPermissions(PERMISSIONS.PROJECTS_CLAIM_MANAGE);

  let supervisor: number | null = null;

  return (
    <Formik
      initialValues={{ name: data.name, description: data.description || '' }}
      onSubmit={values => {
        onSubmit({ ...values, supervisor });
      }}
    >
      {() => (
        <Form className={classes.form}>
          <Typography className={classes.formTitle} variant="h4">
            Update Project
          </Typography>
          {error && <Error error={error} />}
          <div>
            <Field
              name="name"
              type="text"
              placeholder="Project Name"
              label="Project Name"
              component={MyField}
              className={classes.field}
              required
            />
          </div>
          <div>
            <Field
              name="description"
              type="text"
              placeholder="Project Description"
              label="Project Description"
              multiline={true}
              component={MyField}
              className={classes.field}
              rows={4}
              rowsMax={8}
            />
          </div>
          { canManageProjectSupervisor &&
            <Supervisor
              defaultValue={data.supervisor?.name}
              onSupervisorStateChange={id => supervisor = id}
            />
          }
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

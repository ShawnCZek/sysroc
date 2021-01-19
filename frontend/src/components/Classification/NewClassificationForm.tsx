import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ApolloError } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import { Button } from '@material-ui/core';
import { Error } from '../Error';
import { MyField } from '../MyField';
import { ProjectAutocomplete } from '../Project/ProjectAutocomplete';
import { ProjectDto } from '../../generated/graphql';

const useStyles = makeStyles({
  form: {
    padding: '1rem 2rem 2rem',
    margin: '0 auto',
    marginTop: '1.3rem',
  },
  button: {
    marginTop: '1rem',
  },
  field: {
    width: '13rem',
  },
});

interface Values {
  mark: number;
  note: string;
  project: string;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
  userId?: string;
  projectId?: number;
}

export const NewClassificationForm: React.FC<Props> = ({ onSubmit, error, userId, projectId }) => {
  const classes = useStyles();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(projectId ? projectId.toString() : '');
  const [projectError, setProjectError] = useState('');

  const handleAutocompleteChange = (project: ProjectDto | null) => {
    setSelectedProjectId(project?.id);
    setProjectError('');
  };

  return (
    <Formik
      initialValues={{ mark: 1, note: '', project: '' }}
      onSubmit={values => {
        if (selectedProjectId === '' || !selectedProjectId) {
          setProjectError('Please select project!');
          return;
        }

        setProjectError('');
        onSubmit({ ...values, project: projectId ? projectId.toString() : selectedProjectId });
      }}
    >
      {() => (
        <Form className={classes.form}>
          { error && <Error error={error} /> }
          <div>
            <Field
              name="mark"
              type="number"
              placeholder="1"
              label="Mark"
              component={MyField}
              min={1}
              max={5}
              required
            />
          </div>
          { !projectId &&
            <div>
              <Field
                name="project"
                type="number"
                placeholder="Select Project"
                label="Project"
              >
                {() => (
                  <div style={{ marginTop: 10 }}>
                    {projectError && <div style={{ color: 'red' }}>{projectError}</div>}
                    <ProjectAutocomplete userId={userId} handleChange={handleAutocompleteChange} />
                  </div>
                )}
              </Field>
            </div>
          }
          <div>
            <Field
              name="note"
              type="text"
              placeholder="Note"
              label="Note"
              multiline={true}
              component={MyField}
              className={classes.field}
              rows={4}
              rowsMax={8}
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

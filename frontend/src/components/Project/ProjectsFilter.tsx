import { Button, makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import { MyField } from '../MyField';
import { useBaseUsersQuery } from '../../generated/graphql';
import { Autocomplete } from '@material-ui/lab';
import { ComponentLoading } from '../ComponentLoading';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    marginRight: '1rem',
  },
  autoComplete: {
    width: '20rem',
    marginRight: '1rem',
  },
  autoCompleteField: {
    width: '100%',
  }
});

export interface ProjectFilters {
  name?: string;
  authors?: number[];
  supervisors?: number[];
}

interface Props {
  defaultValues: ProjectFilters;
  filterAuthor: boolean;
  onSubmit: (filter: ProjectFilters) => void;
}

export const ProjectsFilter: React.FC<Props> = ({
  defaultValues,
  filterAuthor,
  onSubmit,
}) => {
  const classes = useStyles();

  const { data: authorsData, loading: authorsLoading } = useBaseUsersQuery();
  const { data: supervisorsData, loading: supervisorsLoading } = useBaseUsersQuery({ variables: { admin: true, teacher: true } });

  let authors: number[] | undefined = defaultValues.authors;
  let supervisors: number[] | undefined = defaultValues.supervisors;

  const handleAuthorsChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (filterAuthor && authorsData && authorsData.baseUsers) {
      authors = authorsData.baseUsers.filter(user => value.includes(user.name)).map(user => parseInt(user.id));
    }
  };

  const handleSupervisorsChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (supervisorsData && supervisorsData.baseUsers) {
      supervisors = supervisorsData.baseUsers.filter(user => value.includes(user.name)).map(user => parseInt(user.id));
    }
  };

  // Prepare the default values (which can be forwarded from outside)
  let defaultAuthors: string[] = [];
  if (filterAuthor && authorsData && authorsData.baseUsers) {
    defaultAuthors = authorsData.baseUsers.filter(user => authors?.includes(parseInt(user.id))).map(user => user.name);
  }
  let defaultSupervisors: string[] = [];
  if (supervisorsData && supervisorsData.baseUsers) {
    defaultSupervisors = supervisorsData.baseUsers.filter(user => supervisors?.includes(parseInt(user.id))).map(user => user.name);
  }

  if (authorsLoading || supervisorsLoading) return <ComponentLoading />;

  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={values => {
        onSubmit({ ...values, authors, supervisors });
      }}
    >
      <Form className={classes.form}>
        <Field
          name="name"
          type="text"
          placeholder="Name"
          label="Name"
          component={MyField}
          className={classes.textField}
        />
        {filterAuthor && authorsData?.baseUsers &&
          <Autocomplete
            placeholder="Authors"
            multiple
            options={authorsData.baseUsers.map(user => user.name)}
            onChange={handleAuthorsChange}
            className={classes.autoComplete}
            defaultValue={defaultAuthors}
            renderInput={params => (
              <TextField
                {...params}
                label="Authors"
                className={classes.autoCompleteField}
                variant="standard"
              />
            )}
          />
        }
        <Autocomplete
          placeholder="Supervisors"
          multiple
          options={supervisorsData?.baseUsers?.map(user => user.name) as string[]}
          onChange={handleSupervisorsChange}
          className={classes.autoComplete}
          defaultValue={defaultSupervisors}
          renderInput={params => (
            <TextField
              {...params}
              label="Supervisors"
              className={classes.autoCompleteField}
              variant="standard"
            />
          )}
        />
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

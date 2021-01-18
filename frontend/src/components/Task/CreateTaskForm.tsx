import React from 'react';
import MomentUtils from '@date-io/moment';
import moment, { Moment } from 'moment';
import { Button, makeStyles } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { MyField } from '../MyField';
import { ApolloError } from '@apollo/client';
import { Error } from '../Error';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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
    width: '15rem',
    marginBottom: '1rem',
  },
});

interface Values {
  name: string;
  description: string;
  dueDate: Moment;
}

interface Props {
  onSubmit: (values: Values) => void;
  error: ApolloError | any;
}

export const CreateTaskForm: React.FC<Props> = ({ onSubmit, error }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Formik
        initialValues={{
          name: '',
          description: '',
          dueDate: moment(),
        }}
        onSubmit={values => {
          onSubmit(values);
        }}
      >
        {() => (
          <Form className={classes.form}>
            {error && <Error error={error}/>}
            <div>
              <Field
                name="name"
                type="text"
                placeholder="Task Name"
                label="Task Name"
                component={MyField}
                className={classes.field}
                required
              />
            </div>
            <div>
              <Field
                name="description"
                type="text"
                placeholder="Task Description"
                label="Task Description"
                multiline={true}
                component={MyField}
                className={classes.field}
                rows={4}
                rowsMax={8}
              />
            </div>
            <div>
              <Field name="dueDate">
                {({ field, form }: { field: any; form: any }) => (
                  <DatePicker
                    disableToolbar
                    format="DD.MM.YYYY"
                    label="Due To"
                    name={field.name}
                    value={field.value}
                    className={classes.field}
                    onChange={value =>
                      form.setFieldValue('dueDate', value, true)
                    }
                  />
                )}
              </Field>
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
    </MuiPickersUtilsProvider>
  );
};

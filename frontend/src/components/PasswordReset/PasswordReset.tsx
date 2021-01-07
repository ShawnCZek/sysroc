import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useCreatePasswordResetMutation, useMeQuery } from '../../generated/graphql';
import { PasswordResetForm } from './PasswordResetForm';
import { useSnackbar } from 'notistack';

export const PasswordReset: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error: meError } = useMeQuery();
  const [createPasswordReset, { error }] = useCreatePasswordResetMutation({
    update(store, { data }) {
      if (data?.createPasswordReset) {
        enqueueSnackbar('If the entered email address is correct, you should receive a message with further instructions.', { variant: 'success' });
      }
    }
  });

  if (loading) return <div>Loading...</div>;

  if (!meError) {
    history.push('/');
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <PasswordResetForm
        error={error}
        onSubmit={async ({ email }) => {
          await createPasswordReset({ variables: { email } });
        }}
      />
    </div>
  );
};

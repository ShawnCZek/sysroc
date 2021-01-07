import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { ChangePasswordForm } from './ChangePasswordForm';
import { useChangePasswordMutation, useMeQuery, usePasswordResetQuery } from '../../generated/graphql';
import { useSnackbar } from 'notistack';

interface Props extends RouteComponentProps<{
  hash: string;
}> {}

export const ChangePassword: React.FC<Props> = props => {
  const hash = props.match.params.hash;

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { error: meError } = useMeQuery();
  const { loading, error: queryError } = usePasswordResetQuery({ variables: { hash } });
  const [changePassword, { error }] = useChangePasswordMutation({
    update() {
      enqueueSnackbar('Your password has been successfully updated! Feel free to sign in now.', { variant: 'success' });
      history.push('/');
    }
  });

  if (loading) return <div>Loading...</div>;

  if (queryError || !meError) {
    history.push('/');
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <ChangePasswordForm
        error={error}
        onSubmit={async ({ password, passwordAgain }) => {
          if (password !== passwordAgain) {
            enqueueSnackbar('The passwords do not match!', { variant: 'error' });
            return;
          }

          await changePassword({ variables: { hash, password } });
        }}
      />
    </div>
  );
};

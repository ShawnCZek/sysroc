import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MeDocument, MeQuery, useSignInMutation } from '../generated/graphql';
import { setAccessToken } from '../auth/accessToken';
import { SignInForm } from './SignInForm';
import { setRegisterToken } from '../auth/registerToken';
import { setUserTemp } from '../auth/userTemp';

export const SignIn: React.FC<RouteComponentProps> = ({ history }) => {
  const [signin, { error }] = useSignInMutation();

  return (
    <div style={{ textAlign: 'center' }}>
      <SignInForm
        error={error}
        onSubmit={async ({ email, password }) => {
          const res = await signin({
            variables: { email, password },
            update: (store, { data }) => {
              if (!data) {
                return null;
              }
              if (data.signin.user !== null) {
                store.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    me: {
                      // @ts-ignore
                      user: data.signin.user,
                      __typename: data.signin.__typename,
                    }
                  }
                });
              }
            }
          });

          if (res && res.data) {
            const data = res.data.signin;

            if (data.accessToken) {
              setAccessToken(data.accessToken);

              history.push('/');
              window.location.reload();
            } else if (data.registerToken) {
              setRegisterToken(data.registerToken);
              setUserTemp(data.userTemp);

              history.push('/signup');
            }
          }
        }}
      />
    </div>
  );
};

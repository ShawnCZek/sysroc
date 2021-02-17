import jwtDecode from 'jwt-decode';
import { getAccessToken, setAccessToken } from '../auth/accessToken';
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Config } from '../config/config';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { createUploadLink } from 'apollo-upload-client';

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any;
      Promise.resolve(operation)
        .then(operation => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${accessToken}`
              }
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

export default new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: 'accessToken',
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }

        try {
          const { exp } = jwtDecode(token);
          return Date.now() < exp * 1000;
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch(`${Config.backendApiUrl}/auth/refresh_token`, {
          method: 'POST',
          credentials: 'include'
        });
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
        console.warn('Your refresh token is invalid. Try to relogin');
        console.error(err);
      }
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      console.log(networkError);
    }),
    requestLink,
    createUploadLink({
      uri: Config.backendGraphqlUrl,
      credentials: 'include'
    })
  ]),
  cache
});

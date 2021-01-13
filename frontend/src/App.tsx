import React, { useEffect, useState } from 'react';
import client from './apollo/apollo.client';
import { setAccessToken } from './auth/accessToken';
import { Routes } from './routes/Routes';
import { Config } from './config/config';
import { SnackbarProvider } from 'notistack';
import { ApolloProvider } from '@apollo/client';
import { Loading } from './components/Loading';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${Config.backendApiUrl}/auth/refresh_token`, {
      method: 'POST',
      credentials: 'include'
    }).then(async x => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    </SnackbarProvider>
  );
};

export default App;

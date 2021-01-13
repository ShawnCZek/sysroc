import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { Profile } from './User/Profile';
import { makeStyles, Typography } from '@material-ui/core';
import { InvitationsList } from './Invitation/InvitationsList';

const useStyles = makeStyles({
  mainTitle: {
    marginBottom: '1rem',
  },
  title: {
    marginBottom: '1rem',
    marginTop: '3rem',
  },
});

interface Props {}

export const Home: React.FC<Props> = () => {
  const classes = useStyles();
  const { data, loading } = useMeQuery();

  if (loading) return <div>Loading...</div>;

  if (!data?.me?.user) {
    return (
      <div />
    );
  }

  return (
    <div>
      <Typography variant="h4" className={classes.mainTitle}>My Profile</Typography>
      <Profile userId={parseInt(data.me.user.id)} forceEmail={true} />
      <Typography variant="h4" className={classes.title}>Invitations</Typography>
      <InvitationsList />
    </div>
  );
};

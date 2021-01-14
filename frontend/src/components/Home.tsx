import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { Profile } from './User/Profile';
import { makeStyles, Typography } from '@material-ui/core';
import { InvitationsList } from './Invitation/InvitationsList';
import { ComponentLoading } from './ComponentLoading';
import { Redirect } from 'react-router';

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
  const { data, loading, error } = useMeQuery();

  if (error) return <Redirect to="/signin" />;
  if (loading || !data?.me?.user) return <ComponentLoading />;

  return (
    <div>
      <Typography variant="h4" className={classes.mainTitle}>My Profile</Typography>
      <Profile userId={parseInt(data.me.user.id)} forceEmail={true} />
      <Typography variant="h4" className={classes.title}>Invitations</Typography>
      <InvitationsList />
    </div>
  );
};

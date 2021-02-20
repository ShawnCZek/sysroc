import React from 'react';
import { useHistory } from 'react-router';
import { Fab } from '@material-ui/core';

export const BackButton: React.FC = () => {
  const history = useHistory();

  return (
    <Fab
      color="primary"
      variant="extended"
      onClick={() => {
        history.goBack();
      }}
    >
      Back
    </Fab>
  );
};

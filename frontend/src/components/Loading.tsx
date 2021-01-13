import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

interface Props {
  open?: boolean;
  transparent?: boolean;
}

export const Loading: React.FC<Props> = ({
  open,
  transparent,
}) => {
  const classes = useStyles();

  return (
    <Backdrop
      open={open ?? true}
      transitionDuration={0}
      invisible={transparent ?? true}
      className={classes.backdrop}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

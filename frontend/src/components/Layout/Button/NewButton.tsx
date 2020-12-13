import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Fab, FabProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

export const NewButton: React.FC<FabProps> = (props) => {
  const classes = useStyles();

  return (
    <Fab {...props} color="primary" variant="extended">
      <AddCircleIcon className={classes.extendedIcon}/>
      {props.children}
    </Fab>
  );
};

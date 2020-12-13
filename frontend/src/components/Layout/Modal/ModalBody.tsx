import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

function getStyles() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: '95%',
      overflowY: 'auto',
    },
  })
);

export const ModalBody: React.FC = ({ children }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getStyles);

  return (
    <div style={modalStyle} className={classes.paper}>
      {children}
    </div>
  );
};

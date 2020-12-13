import React from 'react';
import { CheckCircle, CloseRounded } from '@material-ui/icons';

interface Props {
  check: boolean;
}

export const BooleanIcon: React.FC<Props> = (props) => {
  if (props.check) {
    return (
      <CheckCircle color="primary" />
    );
  }

  return (
    <CloseRounded color="error" />
  );
};

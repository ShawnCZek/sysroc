import React from 'react';
import { Link } from '@material-ui/core';
import { useHistory } from 'react-router';

interface Props {
  id: number | string;
  name: string;
}

export const ProjectLink: React.FC<Props> = ({
  id,
  name,
}) => {
  const history = useHistory();
  const url = `/projects/${id}`;

  return (
    <Link
      href={url}
      onClick={(event: any) => {
        event.preventDefault();
        history.push(url);
      }}
    >
      {name}
    </Link>
  );
};

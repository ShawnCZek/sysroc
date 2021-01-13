import React from 'react';
import { ProjectQuery } from '../../generated/graphql';
import { UserLink } from '../UserLink';

interface Props {
  authors: ProjectQuery['project']['users'];
}

export const ProjectsAuthors: React.FC<Props> = ({ authors }) => {
  return (
    <>
      { authors.map(author => (
        <div key={author.id}>
          <UserLink id={parseInt(author.id)} name={author.name} />
        </div>
      )) }
    </>
  );
};

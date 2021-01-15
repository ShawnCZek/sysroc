import React from 'react';
import { BaseUserDto } from '../../generated/graphql';
import { UserLink } from '../UserLink';

interface Props {
  authors: Array<Pick<BaseUserDto, 'id' | 'name'>>;
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

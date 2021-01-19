import React from 'react';
import styled from 'styled-components';
import { NoSsr } from '@material-ui/core';
import { ApolloError } from '@apollo/client';

interface Props {
  error: ApolloError | any;
}

const ErrorStyles = styled.div`
  font-size: 1.2rem;
  padding: 1rem 0;
  width: 100%;
  margin: 1rem auto;
  color: #8e0404;
  strong {
    margin-right: 1.2rem;
  }
  p {
    margin: 0;
    font-weight: 100;
  }
`;

export const Error: React.FC<Props> = ({ error }) => {
  if (!error && !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error: any, i: number) => (
      <NoSsr>
        <ErrorStyles key={i}>
          <p data-test="graphql-error">
            <strong>Whooops!</strong>
            {error.message.replace(/GraphQL Error: |ThrottlerException: /, '')}
          </p>
        </ErrorStyles>
      </NoSsr>
    ));
  }
  return (
    <NoSsr>
      <ErrorStyles>
        <p data-test="graphql-error">
          <strong>Whooops!</strong>
          {error.message.replace(/GraphQL Error: |ThrottlerException: /, '')}
        </p>
      </ErrorStyles>
    </NoSsr>
  );
};

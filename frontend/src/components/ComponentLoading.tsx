import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

const ComponentLoadingBlock = styled.div`
  margin: 1.5rem 0;
  text-align: center;
`;

export const ComponentLoading: React.FC = () => (
  <ComponentLoadingBlock>
    <CircularProgress color="primary" />
  </ComponentLoadingBlock>
);

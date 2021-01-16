import React from 'react';
import styled from 'styled-components';

const ActionStyles = styled.div`
  align-self: center;
`;

export const PageHeaderActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  return (
    <ActionStyles {...props} />
  );
};

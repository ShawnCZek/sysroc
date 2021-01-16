import React from 'react';
import styled from 'styled-components';

const HeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PageHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  return (
    <HeaderStyles {...props} />
  );
};

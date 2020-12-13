import React from 'react';
import styled from 'styled-components';

const HeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PageHeader: React.FC = ({ children }) => {
  return (
    <HeaderStyles>
      {children}
    </HeaderStyles>
  );
};

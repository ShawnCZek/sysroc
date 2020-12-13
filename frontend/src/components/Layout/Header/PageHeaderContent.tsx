import React from 'react';
import styled from 'styled-components';

const ContentStyles = styled.div`
  p {
    font-weight: 300;
  }
`;

export const PageHeaderContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <ContentStyles {...props} />
  );
};

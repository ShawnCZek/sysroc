import styled from 'styled-components';

export const PaperStyles = styled.div`
  & > div {
    overflow-x: auto;
  }
  
  & .flex > div {
    min-width: 10rem;
    
    &.description {
      min-width: 20rem;
    }
  }
`;

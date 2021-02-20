import React from 'react';
import styled from 'styled-components';
import { LinearProgress, LinearProgressProps, Typography } from '@material-ui/core';

const BoxWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-right: .5rem;
`;

const TextWrapper = styled.div`
  width: 13rem;
  text-align: right;
`;

interface Props extends LinearProgressProps {
  valueText: string;
}

export const LinearProgressWithLabel: React.FC<Props> = ({ valueText, ...props }) => (
  <BoxWrapper>
    <ProgressWrapper>
      <LinearProgress variant="determinate" {...props} />
    </ProgressWrapper>
    <TextWrapper>
      <Typography variant="body2" color="textSecondary">{valueText}</Typography>
    </TextWrapper>
  </BoxWrapper>
);

import React from 'react';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';
import { NewClassificationFab } from './NewClassificationFab';

export const ClassificationHeader: React.FC = () => (
  <PageHeader>
    <PageHeaderContent>
      <h2>Classification</h2>
      <p>Review or add new marks!</p>
    </PageHeaderContent>
    <PageHeaderActions>
      <NewClassificationFab />
    </PageHeaderActions>
  </PageHeader>
);

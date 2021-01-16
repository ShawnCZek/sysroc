import React from 'react';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';
import { NewProjectFab } from './NewProjectFab';

export const ProjectsHeader: React.FC = () => (
  <PageHeader>
    <PageHeaderContent>
      <h2>Projects</h2>
      <p>View all projects</p>
    </PageHeaderContent>
    <PageHeaderActions>
      <NewProjectFab />
    </PageHeaderActions>
  </PageHeader>
);

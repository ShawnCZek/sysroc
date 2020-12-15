import React from 'react';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';

export const GroupsHeader: React.FC = () => (
  <PageHeader>
    <PageHeaderContent>
      <h2>Groups</h2>
      <p>Manage group roles coming from the Active Directory application.</p>
    </PageHeaderContent>
  </PageHeader>
);

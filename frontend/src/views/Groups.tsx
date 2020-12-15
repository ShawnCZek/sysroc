import React from 'react';
import { GroupsList } from '../components/Group/GroupsList';
import { GroupsHeader } from '../components/Group/GroupsHeader';

export const Groups: React.FC = () => (
  <>
    <GroupsHeader />
    <GroupsList />
  </>
);

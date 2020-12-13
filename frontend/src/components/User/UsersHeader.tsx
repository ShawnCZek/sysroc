import React from 'react';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';
import { NewButton } from '../Layout/Button/NewButton';

interface Props {
  handleOpen: () => void;
}

export const UsersHeader: React.FC<Props> = ({ handleOpen }) => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <h2>Users</h2>
        <p>Manage users in system</p>
      </PageHeaderContent>
      <PageHeaderActions>
        <NewButton onClick={handleOpen}>
          New User
        </NewButton>
      </PageHeaderActions>
    </PageHeader>
  );
};

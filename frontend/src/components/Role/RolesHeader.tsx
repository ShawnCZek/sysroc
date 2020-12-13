import React from 'react';
import { NewButton } from '../Layout/Button/NewButton';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';

interface Props {
  handleOpen: () => void;
}

export const RolesHeader: React.FC<Props> = ({ handleOpen }) => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <h2>Roles</h2>
        <p>Manage user roles with their permissions in the system.</p>
      </PageHeaderContent>
      <PageHeaderActions>
        <NewButton onClick={handleOpen}>
          New Role
        </NewButton>
      </PageHeaderActions>
    </PageHeader>
  );
};

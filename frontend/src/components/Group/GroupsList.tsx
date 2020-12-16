import React from 'react';
import { useSnackbar } from 'notistack';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { GroupFilter, useDeleteGroupMutation, useGroupsQuery } from '../../generated/graphql';
import { PERMISSIONS } from '../../generated/permissions';
import { Fab, Paper } from '@material-ui/core';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { GroupsFilter } from './GroupsFilter';

export const GroupsList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null);
  const [filters, setFilters] = React.useState<GroupFilter>({ id: 0, order: '', name: '' });

  const { data, loading } = useGroupsQuery({ variables: filters });

  const [deleteGroup, { client }] = useDeleteGroupMutation({
    async update(cache, result) {
      if (!result.data?.deleteGroup) {
        enqueueSnackbar('An error occurred while deleting the group.', { variant: 'error' });
        return;
      }

      await client.resetStore();
      enqueueSnackbar('Group deleted!', { variant: 'success' });
      handleCloseDeleteDialog();
    }
  });

  const canDeleteGroup = useHasPermissions(PERMISSIONS.GROUP_MANAGE);

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
  const handleSubmitDeleteDialog = async (groupId: number) => {
    await deleteGroup({ variables: { id: groupId } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <GroupsFilter
        defaultValues={filters}
        onSubmit={filter => {
          setFilters(filter);
        }}
      />
      <h2>Groups List</h2>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>Name</div>
            </Item>
            <Item>
              <div>Users</div>
            </Item>
            <Item>
              <div>Action</div>
            </Item>
          </div>
          { data?.groups && data.groups.map(group => (
            <div key={group.id} className="flex">
              <Item>
                <div>{group.name}</div>
              </Item>
              <Item>
                <div>{group.usersCount}</div>
              </Item>
              <Item className="actions">
                { canDeleteGroup &&
                  <Fab
                    color="secondary"
                    variant="extended"
                    onClick={() => {
                      setSelectedGroupId(parseInt(group.id));
                      handleOpenDeleteDialog();
                    }}
                  >
                    Delete
                  </Fab>
                }
              </Item>
            </div>
          )) }
        </List>
      </Paper>
      { canDeleteGroup &&
        <DeleteGroupDialog
          groupId={selectedGroupId ?? 0}
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onSubmit={handleSubmitDeleteDialog}
        />
      }
    </div>
  );
};

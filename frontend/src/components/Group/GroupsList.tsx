import React from 'react';
import { useSnackbar } from 'notistack';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { GroupFilter, useDeleteGroupMutation, useGroupsQuery } from '../../generated/graphql';
import { PERMISSIONS } from '../../generated/permissions';
import { Fab, Paper } from '@material-ui/core';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { GroupsFilter, GroupsSort } from './GroupsFilter';
import { ComponentLoading } from '../ComponentLoading';

export const GroupsList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null);
  const [filters, setFilters] = React.useState<GroupFilter>({ name: '' });
  const [order, setOrder] = React.useState<GroupsSort | undefined>();

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

  if (loading || !data?.groups) return <ComponentLoading />;

  let groups = data.groups.slice().sort((a, b) => a.name > b.name ? 1 : (b.name > a.name ? -1 : 0));
  groups = groups.sort((a, b) => {
    if (order === 'name_desc') {
      return b.name > a.name ? 1 : (a.name > b.name ? -1 : 0);
    } else if (order === 'users_asc') {
      return a.usersCount - b.usersCount;
    } else if (order === 'users_desc') {
      return b.usersCount - a.usersCount;
    }
    return 0;
  });

  return (
    <div>
      <GroupsFilter
        defaultValues={filters}
        onSubmit={(filter: GroupFilter, order: GroupsSort) => {
          setFilters(filter);
          setOrder(order);
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
          { groups.map(group => (
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

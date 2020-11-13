import React, { useState } from 'react';
import { useClassificationsQuery, useDeleteClassificationMutation, useMeExtendedQuery } from '../../generated/graphql';
import { Item } from '../Layout/Item';
import { List } from '../Layout/List';
import moment from 'moment';
import { ClassificationFilter, ClassificationFilters } from './ClassificationFilter';
import { Fab, Paper } from '@material-ui/core';
import { DeleteClassificationDialog } from './DeleteClassificationDialog';
import { useSnackbar } from 'notistack';
import { hasPermissions } from '../../auth/hasPermissions';
import { UpdateClassificationModal } from './UpdateClassificationModal';
import { UserLink } from '../UserLink';

interface Props {
  userId?: string;
}

export const ClassificationList: React.FC<Props> = ({ userId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState<ClassificationFilters>({
    projects: [],
    users: [],
    fromDate: undefined,
    toDate: undefined,
  });

  const [classificationData, setClassificationData] = useState<any>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const { data, loading } = useClassificationsQuery({ variables: filters });
  const { data: me, loading: meLoading } = useMeExtendedQuery();
  const [deleteClassification, { client }] = useDeleteClassificationMutation({
    async update(cache, result) {
      if (!result.data?.deleteClassification) {
        enqueueSnackbar('An error occurred while deleting the classification.', { variant: 'error' });
        return;
      }

      enqueueSnackbar('Classification deleted!', { variant: 'success' });
      client?.resetStore();
    }
  });

  const [deleteClassificationDialogOpen, setDeleteClassificationDialogOpen] = useState(false);
  const [selectedClassificationId, setSelectedClassificationId] = useState<number | null>(null);

  const canManageClassification = me && me.me && hasPermissions(me.me, 'classification.manage');

  const handleDeleteClassificationDialogClose = () => setDeleteClassificationDialogOpen(false);
  const handleDeleteClassificationDialogSubmit = async (classificationId: number) => {
    await deleteClassification({ variables: { id: classificationId } });
  };

  const handleUpdateModalOpen = () => setUpdateModalOpen(true);
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

  if (loading || meLoading) return <div>Loading...</div>;

  return (
    <div>
      <ClassificationFilter defaultValues={filters} onSubmit={(filter) => {
        setFilters(filter);
      }}/>
      <h2>Classification List</h2>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>Mark</div>
            </Item>
            <Item>
              <div>Note</div>
            </Item>
            <Item>
              <div>Project</div>
            </Item>
            <Item>
              <div>User</div>
            </Item>
            <Item>
              <div>Created</div>
            </Item>
            <Item>
              <div>Action</div>
            </Item>
          </div>
          {data && data.classifications && data.classifications.map(classification => (
            <div key={classification.id} className="flex">
              <Item>
                <div>{classification.mark}</div>
              </Item>
              <Item>
                <div>{classification.note}</div>
              </Item>
              <Item>
                <div>{classification.project.name}</div>
              </Item>
              <Item>
                <div><UserLink id={classification.user.id} name={classification.user.name} /></div>
              </Item>
              <Item>
                <div>{moment(classification.createdAt).format('DD. MM. YYYY, dddd')}</div>
              </Item>
              <Item className='actions'>
                {canManageClassification && (
                  <>
                    <Fab
                      color="primary"
                      variant="extended"
                      onClick={() => {
                        setSelectedClassificationId(classification.id);
                        setClassificationData({
                          mark: classification.mark,
                          note: classification.note,
                          project: classification.project.id
                        });
                        handleUpdateModalOpen();
                      }}
                    >
                      Edit
                    </Fab>
                    <Fab
                      color="secondary"
                      variant="extended"
                      onClick={() => {
                        setSelectedClassificationId(classification.id);
                        setDeleteClassificationDialogOpen(true);
                      }}
                    >
                      Delete
                    </Fab>
                  </>
                )}
              </Item>
            </div>
          ))}
        </List>
      </Paper>
      {canManageClassification && (
        <>
          <DeleteClassificationDialog
            onSubmit={handleDeleteClassificationDialogSubmit}
            classificationId={selectedClassificationId ?? 0}
            onClose={handleDeleteClassificationDialogClose}
            open={deleteClassificationDialogOpen}
          />
          <UpdateClassificationModal
            open={updateModalOpen}
            handleClose={handleUpdateModalClose}
            classificationId={selectedClassificationId ?? 0}
            data={classificationData}
            userId={userId}
          />
        </>
      )}
    </div>
  );
};

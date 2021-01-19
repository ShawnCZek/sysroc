import moment from 'moment';
import React from 'react';
import { ClassificationDto } from '../../generated/graphql';
import { Modal, Paper } from '@material-ui/core';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { ModalBody } from '../Layout/Modal/ModalBody';
import { PageHeader } from '../Layout/Header/PageHeader';
import { PageHeaderContent } from '../Layout/Header/PageHeaderContent';
import { PageHeaderActions } from '../Layout/Header/PageHeaderActions';
import { NewClassificationFab } from '../Classification/NewClassificationFab';

interface Props {
  open: boolean;
  handleClose: () => void;
  classification: ClassificationDto[];
  projectId: number;
}

export const ProjectClassificationOverview: React.FC<Props> = ({ open, handleClose, classification, projectId }) => (
  <Modal
    aria-labelledby="project classification overview"
    aria-describedby="modal with project classification overview"
    open={open}
    onClose={handleClose}
  >
    <ModalBody width={850}>
      <PageHeader>
        <PageHeaderContent>
          <h2>Classification Overview</h2>
        </PageHeaderContent>
        <PageHeaderActions>
          <NewClassificationFab projectId={projectId} />
        </PageHeaderActions>
      </PageHeader>
      <p>Great job!</p>
      <Paper>
        <List>
          <div className="flex">
            <Item>
              <div>Mark</div>
            </Item>
            <Item>
              <div>User</div>
            </Item>
            <Item>
              <div>Created</div>
            </Item>
          </div>
          { classification.map(({ id, user, createdAt, mark }) => (
            <div key={id} className="flex">
              <Item>
                <div>{mark}</div>
              </Item>
              <Item>
                <div>{user.name}</div>
              </Item>
              <Item>
                <div>{moment(createdAt).format('DD. MM. YYYY')}</div>
              </Item>
            </div>
          )) }
          { classification.length === 0 && (
            <div className="flex">
              <Item>
                This project has no classification.
              </Item>
            </div>
          ) }
        </List>
      </Paper>
    </ModalBody>
  </Modal>
);

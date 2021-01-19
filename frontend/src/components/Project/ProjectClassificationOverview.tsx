import moment from 'moment';
import React from 'react';
import { ClassificationDto } from '../../generated/graphql';
import { Modal, Paper } from '@material-ui/core';
import { List } from '../Layout/List';
import { Item } from '../Layout/Item';
import { ModalBody } from '../Layout/Modal/ModalBody';

interface Props {
  open: boolean;
  handleClose: () => void;
  classification: ClassificationDto[];
}

export const ProjectClassificationOverview: React.FC<Props> = ({ open, handleClose, classification }) => (
  <Modal
    aria-labelledby="project classification overview"
    aria-describedby="modal with project classification overview"
    open={open}
    onClose={handleClose}
  >
    <ModalBody width={850}>
      <h2 id="new-project-modal-title">Classification Overview</h2>
      <p id="new-project-modal-description">Great job</p>
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

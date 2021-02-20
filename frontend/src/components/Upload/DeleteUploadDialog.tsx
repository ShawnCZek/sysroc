import React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DeleteDialog } from '../Layout/Dialog/DeleteDialog';
import { Typography } from '@material-ui/core';

interface Props {
  uploadId: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (uploadId: number) => Promise<void>;
}

export const DeleteUploadDialog: React.FC<Props> = ({
  uploadId,
  open,
  onClose,
  onSubmit,
}) => (
  <DeleteDialog
    entity={uploadId}
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
  >
    <DialogContentText>
      <Typography>Are you sure you want to delete this uploaded file?</Typography>
      <Typography>This action cannot be reverted!</Typography>
    </DialogContentText>
  </DeleteDialog>
);

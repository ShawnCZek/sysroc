import React from 'react';
import moment from 'moment';
import humanFileSize from '../../utils/humanFileSize';
import { UploadDto } from '../../generated/graphql';
import { Box, Button, ButtonProps, Link, makeStyles, Typography } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import { Config } from '../../config/config';

const useStyles = makeStyles(theme => ({
  uploadButtons: {
    display: 'flex',
  },
  details: {
    height: '3rem',
  },
  paragraph: {
    marginTop: 0,
    display: 'block',
    lineHeight: 1,
  },
  downloadLink: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  download: {
    marginRight: theme.spacing(1),
  },
}));

interface Props extends Pick<ButtonProps, 'color'> {
  upload?: Pick<UploadDto, 'id' | 'name' | 'token' | 'size' | 'typeName' | 'createdAt'>;
}

export const UploadDetails: React.FC<Props> = ({
  upload,
  color,
  children
}) => {
  const classes = useStyles();

  if (!upload) {
    return (
      <>
        <Box className={classes.details}>
          <Typography color="textSecondary">No file</Typography>
        </Box>
        {children}
      </>
    );
  }

  return (
    <>
      <Box className={classes.details}>
        <Typography variant="caption" className={classes.paragraph}>Size: {humanFileSize(upload.size)}</Typography>
        <Typography variant="caption" className={classes.paragraph}>Date: {moment(upload.createdAt).format('Do MMMM YYYY HH:mm')}</Typography>
      </Box>
      <div className={classes.uploadButtons}>
        <div>
          <Link
            className={classes.downloadLink}
            href={`${Config.backendApiUrl}/uploads/download/${upload.token}`}
            target="_blank"
          >
            <Button
              variant="contained"
              component="span"
              color={color}
              className={classes.download}
              startIcon={<CloudDownload />}
            >
              Download
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </>
  );
};

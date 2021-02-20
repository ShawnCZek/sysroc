import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import humanFileSize from '../../utils/humanFileSize';
import { UploadDto, UploadType, useProjectDetailsQuery } from '../../generated/graphql';
import { Assessment, CloudDownload, Code, Delete, Description, PresentToAll } from '@material-ui/icons';
import { Fab, Link, Typography } from '@material-ui/core';
import { Config } from '../../config/config';
import { useHasPermissions } from '../../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../../generated/permissions';

export const UploadStyles = styled.div`
  padding: 1rem 1.4rem;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(2rem, 1fr) 4fr 4fr 3fr;
  
  &:nth-child(odd) {
    background-color: ${grey[100]};
  }
  
  & > div {
    display: flex;
    align-items: center;
  }
  
  .upload-icon {
    grid-column: 1 / 2;
  }
  
  .upload-name {
    grid-column: 2 / 3;
    
    & > span {
      margin-left: .35rem;
    }
  }
  
  .upload-date {
    grid-column: 3 / 4;
  }
  
  .upload-actions {
    grid-column: 4 / 5;
    justify-content: space-around;
  }
  
  .no-upload {
    grid-column: 1 / 5;
  }
`;

interface Props {
  projectId: number;
  upload: UploadDto;
  onSelectDelete: (uploadId: number) => void;
}

export const Upload: React.FC<Props> = ({ projectId, upload, onSelectDelete }) => {
  const { data: details, loading: detailsLoading } = useProjectDetailsQuery({ variables: { id: projectId } });

  const canManageProjects = useHasPermissions(PERMISSIONS.PROJECTS_MANAGE);

  if (detailsLoading || !details?.projectDetails) return null;

  return (
    <UploadStyles>
      <div className="upload-icon">
        { upload.type === UploadType.Documentation && <Description /> }
        { upload.type === UploadType.Presentation && <PresentToAll /> }
        { upload.type === UploadType.Analysis && <Assessment /> }
        { upload.type === UploadType.Project && <Code /> }
      </div>
      <div className="upload-name">
        <span>{upload.typeName}</span>
        <Typography variant="caption">({humanFileSize(upload.size)})</Typography>
      </div>
      <div className="upload-date">
        {moment(upload.createdAt).format('Do MMMM YYYY HH:mm')}
      </div>
      <div className="upload-actions">
        <Link href={`${Config.backendApiUrl}/uploads/download/${upload.token}`} target="_blank">
          <Fab color="primary" variant="extended">
            <CloudDownload />
          </Fab>
        </Link>
        { (details.projectDetails.isAuthor || canManageProjects) && (
          <Fab
            color="secondary"
            variant="extended"
            onClick={() => onSelectDelete(parseInt(upload.id))}
          >
            <Delete />
          </Fab>
        ) }
      </div>
    </UploadStyles>
  );
};

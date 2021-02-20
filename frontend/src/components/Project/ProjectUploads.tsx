import React from 'react';
import styled from 'styled-components';
import humanFileSize from '../../utils/humanFileSize';
import { UploadDto, useProjectDetailsQuery } from '../../generated/graphql';
import { UploadsList } from '../Upload/UploadsList';
import { LinearProgressWithLabel } from '../Layout/Progress/LinearProgressWithLabel';
import { ComponentLoading } from '../ComponentLoading';
import { ProjectFiles, UploadForm } from '../Upload/UploadForm';

const ProjectUploadsWrapper = styled.div`
  margin: 3rem 0 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ProjectUploadsList = styled.div`
  width: 100%;
  max-width: 40rem;
  margin: auto;
`;

const ProgressWrapper = styled.div`
  margin-bottom: 2rem;
`;

interface Props {
  projectId: number;
  uploads: UploadDto[];
  projectFiles?: ProjectFiles | null;
}

export const ProjectUploads: React.FC<Props> = ({ projectId, uploads, projectFiles }) => {
  const { data: details, loading: detailsLoading } = useProjectDetailsQuery({ variables: { id: projectId } });

  if (detailsLoading || !details?.projectDetails) return <ComponentLoading />

  return (
    <ProjectUploadsWrapper>
      <div>
        <UploadForm
          projectId={projectId}
          uploads={uploads}
          projectFiles={projectFiles}
        />
      </div>
      <ProjectUploadsList>
        <ProgressWrapper>
          <LinearProgressWithLabel
            value={(details.projectDetails.size / details.projectDetails.maxSize) * 100}
            valueText={`${humanFileSize(details.projectDetails.size, false, 2)} / ${humanFileSize(details.projectDetails.maxSize, false, 2)}`}
          />
        </ProgressWrapper>
        <UploadsList projectId={projectId} uploads={uploads} />
      </ProjectUploadsList>
    </ProjectUploadsWrapper>
  );
};

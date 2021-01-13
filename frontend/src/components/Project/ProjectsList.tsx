import React, { useState } from 'react';
import { useProjectsQuery } from '../../generated/graphql';
import { ProjectFilters, ProjectsFilter } from './ProjectsFilter';
import { ProjectsTable } from './ProjectsTable';
import { ComponentLoading } from '../ComponentLoading';

export const ProjectsList: React.FC = () => {
  const [filters, setFilters] = useState<ProjectFilters>({ name: '', authors: [], supervisors: [] });
  const { data, loading } = useProjectsQuery({ variables: filters });

  if (loading || !data?.projects) return <ComponentLoading />;

  return (
    <div>
      <ProjectsFilter
        defaultValues={filters}
        filterAuthor={true}
        onSubmit={(filter) => {
          setFilters(filter);
        }}
      />
      <h2>Projects List</h2>
      <ProjectsTable projects={data.projects} />
    </div>
  );
};

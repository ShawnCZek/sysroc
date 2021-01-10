import React, { useState } from 'react';
import { useProjectsQuery } from '../../generated/graphql';
import { ProjectFilters, ProjectsFilter } from './ProjectsFilter';
import { ProjectsTable } from './ProjectsTable';

export const ProjectsList: React.FC = () => {
  const [filters, setFilters] = useState<ProjectFilters>({ name: '', authors: [], supervisors: [] });
  const { data, loading } = useProjectsQuery({ variables: filters });

  if (loading || !data?.projects) return <div>Loading...</div>;

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

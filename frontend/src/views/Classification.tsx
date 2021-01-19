import React from 'react';
import { ClassificationHeader } from '../components/Classification/ClassificationHeader';
import { useMeQuery } from '../generated/graphql';
import { ClassificationList } from '../components/Classification/ClassificationList';
import { ComponentLoading } from '../components/ComponentLoading';

export const Classification: React.FC = () => {
  const { data, loading } = useMeQuery();

  if (loading) return <ComponentLoading />;

  return (
    <>
      <ClassificationHeader />
      <ClassificationList userId={data?.me?.user?.id} />
    </>
  );
};

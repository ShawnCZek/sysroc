import React from 'react';
import { ClassificationHeader } from '../components/Classification/ClassificationHeader';
import { useMeQuery } from '../generated/graphql';
import { NewClassificationModal } from '../components/Classification/NewClassificationModal';
import { ClassificationList } from '../components/Classification/ClassificationList';
import { ComponentLoading } from '../components/ComponentLoading';

export const Classification: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { data, loading } = useMeQuery();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (loading) return <ComponentLoading />;

  return (
    <>
      <ClassificationHeader handleOpen={handleOpen}/>
      <ClassificationList userId={data?.me?.user?.id}/>
      <NewClassificationModal open={open} handleClose={handleClose} userId={data?.me?.user?.id}/>
    </>
  );
};

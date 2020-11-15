import React from 'react';
import { MeDocument, MeQuery, useMeQuery, useUpdateProfileMutation } from '../generated/graphql';
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import { SettingsForm } from '../components/Settings/SettingsForm';
import { useSnackbar } from 'notistack';

export interface ProfileValues {
  name: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  passwordAgain?: string;
}

export const Settings: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { loading } = useMeQuery();
  const [updateProfile, { error }] = useUpdateProfileMutation({
    update(cache, result) {
      try {
        if (result.data?.updateProfile) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: result.data.updateProfile,
            }
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        }
      }
    }
  });

  const onSubmit = async (values: ProfileValues) => {
    await updateProfile({ variables: values });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SettingsHeader />
      <SettingsForm
        onSubmit={onSubmit}
        error={error}
      />
    </>
  );
};

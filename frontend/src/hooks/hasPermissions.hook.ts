import { useEffect, useState } from 'react';
import { useMyPermissionsQuery } from '../generated/graphql';
import { hasPermissions } from '../auth/hasPermissions';

/**
 * Check whether the user is permitted to do this action.
 *
 * The user must have at least one of the presented permissions.
 * Permissions are forwarded as a parameter each, not as a single list.
 *
 * @param permissions
 */
export function useHasPermissions(...permissions: string[]): boolean {
  const [authorized, setAuthorized] = useState(false);
  const { data, loading } = useMyPermissionsQuery();

  useEffect(() => {
    if (!loading && data) {
      const hasAccess = hasPermissions(data.myPermissions, ...permissions);
      if (hasAccess) setAuthorized(true);
    }
  }, [data, loading, permissions]);

  return authorized;
}

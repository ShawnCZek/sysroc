import { PermissionStateDto } from '../generated/graphql';

/**
 * Check whether the user is permitted to do this action.
 *
 * The user must have at least one of the presented permissions.
 * Permissions are forwarded as a parameter each, not as a single list.
 *
 * If possible, use the hook instead of this method. This simple logic is useful only for places like routing.
 *
 * @param permissionData
 * @param permissions
 */
export const hasPermissions = (permissionData: Array<PermissionStateDto> | undefined, ...permissions: string[]): boolean => {
  if (!permissionData) {
    return false;
  }

  for (const slug of permissions) {
    if (permissionData.some(permission => permission.slug === slug && permission.permitted)) {
      return true;
    }
  }
  return false;
};

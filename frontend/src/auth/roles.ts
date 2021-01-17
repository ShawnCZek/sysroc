import { PermissionDto } from '../generated/graphql';
import { PERMISSIONS } from '../generated/permissions';

interface UserRoleDto {
  admin: boolean;
  permissions?: Array<Pick<PermissionDto, 'slug'>>;
}

interface UserWithRolesDto {
  roles: UserRoleDto[];
}

/**
 * Determine whether the user is an administrator.
 *
 * @param user
 */
export function isAdmin(user: UserWithRolesDto | undefined | null): boolean {
  if (!user) {
    return false;
  }

  return user.roles.some(role => role.admin);
}

/**
 * Determine whether the user is a teacher.
 *
 * @param user
 */
export function isTeacher(user: UserWithRolesDto | undefined | null): boolean {
  if (isAdmin(user)) {
    return true;
  }

  if (!user) {
    return false;
  }

  return user.roles.some(role => role.permissions && role.permissions.map(permission => permission.slug).includes(PERMISSIONS.PROJECTS_CLAIM));
}

/**
 * Determine whether the user is a student.
 *
 * @param user
 */
export function isStudent(user: UserWithRolesDto | undefined | null): boolean {
  if (isAdmin(user)) {
    return true;
  }

  if (!user) {
    return false;
  }

  return user.roles.some(role => role.permissions && role.permissions.map(permission => permission.slug).includes(PERMISSIONS.PROJECTS_CREATE));
}

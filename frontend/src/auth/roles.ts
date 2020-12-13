interface UserRoleDto {
  admin: boolean;
  teacher: boolean;
  student: boolean;
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
 * The user must have at least one role with the teacher attribute.
 *
 * @param user
 */
export function isTeacher(user: UserWithRolesDto | undefined | null): boolean {
  if (!user) {
    return false;
  }

  return user.roles.some(role => role.teacher);
}

/**
 * Determine whether the user is a student.
 *
 * The user must have at least one role with the student attribute.
 *
 * @param user
 */
export function isStudent(user: UserWithRolesDto | undefined | null): boolean {
  if (!user) {
    return false;
  }

  return user.roles.some(role => role.student);
}

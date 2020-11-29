export const ROLES = {
  // Has all permissions and no restrictions; usually manages the site
  ADMIN: 'admin',

  // Manages and supervises projects and everything related to it
  TEACHER: 'teacher',

  // Can create and manage own projects
  STUDENT: 'student',

  // Can only view their own projects, has no other permissions
  GUEST: 'guest',
};

import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AdUser = {
  __typename?: 'ADUser';
  dn: Scalars['String'];
  userPrincipalName: Scalars['String'];
  cn: Scalars['String'];
};

export type AllUsersFilter = {
  roles?: Maybe<Array<Scalars['Float']>>;
  rolesSlug?: Maybe<Array<Scalars['String']>>;
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  groups?: Maybe<Array<Scalars['Float']>>;
  email?: Maybe<Scalars['String']>;
  adEmail?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type BaseUserDto = {
  __typename?: 'BaseUserDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  groups: Array<GroupDto>;
  roles: Array<RoleDto>;
};

export type BaseUsersFilter = {
  roles?: Maybe<Array<Scalars['Float']>>;
  rolesSlug?: Maybe<Array<Scalars['String']>>;
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  groups?: Maybe<Array<Scalars['Float']>>;
};

export type Classification = {
  __typename?: 'Classification';
  id: Scalars['ID'];
  mark: Scalars['Float'];
  note: Scalars['String'];
  createdAt: Scalars['DateTime'];
  project: Project;
  user: User;
};

export type ClassificationDto = {
  __typename?: 'ClassificationDto';
  id: Scalars['Float'];
  mark: Scalars['Float'];
  note: Scalars['String'];
  createdAt: Scalars['DateTime'];
  project: ProjectDto;
  user: UserDto;
};

export type ClassificationsFilter = {
  id?: Maybe<Scalars['Float']>;
  projects?: Maybe<Array<Scalars['Float']>>;
  users?: Maybe<Array<Scalars['Float']>>;
  fromDate?: Maybe<Scalars['DateTime']>;
  toDate?: Maybe<Scalars['DateTime']>;
};

export type CreateClassificationDto = {
  mark: Scalars['Float'];
  note?: Maybe<Scalars['String']>;
  project: Scalars['Float'];
  user: Scalars['Float'];
};

export type CreatePasswordResetDto = {
  email: Scalars['String'];
};

export type CreateProjectDto = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CreateRoleDto = {
  name: Scalars['String'];
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  permissionSlugs?: Maybe<Array<Scalars['String']>>;
};

export type CreateTaskDto = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate: Scalars['DateTime'];
  completed?: Maybe<Scalars['Boolean']>;
  project: Scalars['Float'];
};

export type CreateUserDto = {
  name: Scalars['String'];
  adEmail?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  roleSlugs?: Maybe<Array<Scalars['String']>>;
};


export type Group = {
  __typename?: 'Group';
  id: Scalars['ID'];
  name: Scalars['String'];
  users: Array<User>;
  usersCount?: Maybe<Scalars['Float']>;
};

export type GroupDto = {
  __typename?: 'GroupDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  users: Array<UserDto>;
  usersCount?: Maybe<Scalars['Float']>;
};

export type GroupFilter = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
};

export type Invitation = {
  __typename?: 'Invitation';
  id: Scalars['ID'];
  project: Project;
  invited: User;
  user: User;
  createdAt: Scalars['DateTime'];
};

export type InvitationDto = {
  __typename?: 'InvitationDto';
  id: Scalars['ID'];
  project: ProjectDto;
  invited: BaseUserDto;
  user: BaseUserDto;
  createdAt: Scalars['DateTime'];
};

export type InviteDto = {
  project: Scalars['ID'];
  email: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteGroup: GroupDto;
  createUser: UserDto;
  signup: UserAuthDto;
  signin: UserAuthDto;
  updateUser: UserDto;
  updateProfile: UserAuthDto;
  logout: Scalars['Boolean'];
  deleteUser: UserDto;
  createRole: RoleDto;
  updateRole: RoleDto;
  deleteRole: RoleDto;
  createProject: ProjectDto;
  updateProject: ProjectDto;
  claimProject: ProjectDto;
  deleteProject: ProjectDto;
  createTask: TaskDto;
  deleteTask: TaskDto;
  updateTask: TaskDto;
  createClassification: ClassificationDto;
  deleteClassification: ClassificationDto;
  updateClassification: ClassificationDto;
  createPasswordReset: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  invite: InvitationDto;
  acceptInvitation: InvitationDto;
  deleteInvitation: InvitationDto;
};


export type MutationDeleteGroupArgs = {
  groupId: Scalars['Float'];
};


export type MutationCreateUserArgs = {
  input: CreateUserDto;
};


export type MutationSignupArgs = {
  input: SignUpUserDto;
};


export type MutationSigninArgs = {
  auth: UserAuthInputDto;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserDto;
  filter: UsersFilter;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileDto;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Float'];
};


export type MutationCreateRoleArgs = {
  input: CreateRoleDto;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleDto;
  filter: RolesFilter;
};


export type MutationDeleteRoleArgs = {
  roleId: Scalars['Float'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectDto;
};


export type MutationUpdateProjectArgs = {
  updates: UpdateProjectDto;
  filter: ProjectsFilter;
};


export type MutationClaimProjectArgs = {
  filter: ProjectsFilter;
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['Float'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskDto;
};


export type MutationDeleteTaskArgs = {
  filter: TasksFilter;
};


export type MutationUpdateTaskArgs = {
  updates: UpdateTaskDto;
  filter: TasksFilter;
};


export type MutationCreateClassificationArgs = {
  input: CreateClassificationDto;
};


export type MutationDeleteClassificationArgs = {
  filter: ClassificationsFilter;
};


export type MutationUpdateClassificationArgs = {
  updates: UpdateClassificationDto;
  filter: ClassificationsFilter;
};


export type MutationCreatePasswordResetArgs = {
  input: CreatePasswordResetDto;
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  hash: Scalars['String'];
};


export type MutationInviteArgs = {
  input: InviteDto;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['Float'];
};


export type MutationDeleteInvitationArgs = {
  invitationId: Scalars['Float'];
};

export type PasswordResetDto = {
  __typename?: 'PasswordResetDto';
  id: Scalars['ID'];
  user: UserDto;
  hash: Scalars['String'];
  used: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type Permission = {
  __typename?: 'Permission';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  roles: Array<Role>;
};

export type PermissionDto = {
  __typename?: 'PermissionDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type PermissionStateDto = {
  __typename?: 'PermissionStateDto';
  slug: Scalars['String'];
  permitted: Scalars['Boolean'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  owner: User;
  users: Array<User>;
  supervisor: User;
  tasks: Array<Task>;
  classifications: Array<Classification>;
  invitations: Array<Invitation>;
  createdAt: Scalars['DateTime'];
};

export type ProjectDetailsDto = {
  __typename?: 'ProjectDetailsDto';
  isOwner: Scalars['Boolean'];
  isAuthor: Scalars['Boolean'];
};

export type ProjectDto = {
  __typename?: 'ProjectDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  owner: UserDto;
  users: Array<UserDto>;
  supervisor?: Maybe<UserDto>;
  tasks: Array<TaskDto>;
  classifications: Array<ClassificationDto>;
  createdAt: Scalars['DateTime'];
};

export type ProjectsFilter = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  authors?: Maybe<Array<Scalars['Float']>>;
  supervisors?: Maybe<Array<Scalars['Float']>>;
};

export type Query = {
  __typename?: 'Query';
  groups: Array<GroupDto>;
  user: UserDto;
  users: Array<UserDto>;
  baseUsers: Array<BaseUserDto>;
  me?: Maybe<UserAuthDto>;
  myPermissions: Array<PermissionStateDto>;
  roles: Array<RoleDto>;
  permissions: Array<PermissionDto>;
  authUser: AdUser;
  projects: Array<ProjectDto>;
  project: ProjectDto;
  projectDetails: ProjectDetailsDto;
  task: TaskDto;
  classifications: Array<ClassificationDto>;
  passwordReset: PasswordResetDto;
  invitations: Array<InvitationDto>;
  myInvitations: Array<InvitationDto>;
};


export type QueryGroupsArgs = {
  filter: GroupFilter;
};


export type QueryUserArgs = {
  filter: UsersFilter;
};


export type QueryUsersArgs = {
  filter: AllUsersFilter;
};


export type QueryBaseUsersArgs = {
  filter: BaseUsersFilter;
};


export type QueryRolesArgs = {
  filter: RolesFilter;
};


export type QueryAuthUserArgs = {
  auth: UserAuthInputDto;
};


export type QueryProjectsArgs = {
  filter: ProjectsFilter;
};


export type QueryProjectArgs = {
  projectId: Scalars['Float'];
};


export type QueryProjectDetailsArgs = {
  projectId: Scalars['Float'];
};


export type QueryTaskArgs = {
  filter: TasksFilter;
};


export type QueryClassificationsArgs = {
  filter: ClassificationsFilter;
};


export type QueryPasswordResetArgs = {
  hash: Scalars['String'];
};


export type QueryInvitationsArgs = {
  projectId: Scalars['Float'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  system: Scalars['Boolean'];
  admin: Scalars['Boolean'];
  teacher: Scalars['Boolean'];
  student: Scalars['Boolean'];
  permissions: Array<Permission>;
  users: Array<User>;
};

export type RoleDto = {
  __typename?: 'RoleDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  system: Scalars['Boolean'];
  admin: Scalars['Boolean'];
  teacher: Scalars['Boolean'];
  student: Scalars['Boolean'];
  permissions: Array<PermissionDto>;
};

export type RolesFilter = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  permission?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
};

export type SignUpUserDto = {
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  dueDate: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  completed: Scalars['Boolean'];
  project: Project;
};

export type TaskDto = {
  __typename?: 'TaskDto';
  id: Scalars['Float'];
  name: Scalars['String'];
  description: Scalars['String'];
  dueDate: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  completed: Scalars['Boolean'];
  project: ProjectDto;
};

export type TasksFilter = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type UpdateClassificationDto = {
  mark: Scalars['Float'];
  note: Scalars['String'];
  projectId?: Maybe<Scalars['Float']>;
};

export type UpdateProfileDto = {
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  oldPassword?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  passwordAgain?: Maybe<Scalars['String']>;
};

export type UpdateProjectDto = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  supervisor?: Maybe<Scalars['Float']>;
};

export type UpdateRoleDto = {
  name: Scalars['String'];
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  permissionSlugs?: Maybe<Array<Scalars['String']>>;
};

export type UpdateTaskDto = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  completed?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserDto = {
  name: Scalars['String'];
  email: Scalars['String'];
  roleSlugs?: Maybe<Array<Scalars['String']>>;
  groups?: Maybe<Array<Scalars['Float']>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  adEmail: Scalars['String'];
  roles: Array<Role>;
  groups: Array<Group>;
  projects: Array<Project>;
  classifications: Array<Classification>;
  supervisedProjects: Array<Project>;
  invitations: Array<Invitation>;
};

export type UserAuthDto = {
  __typename?: 'UserAuthDto';
  accessToken?: Maybe<Scalars['String']>;
  user?: Maybe<UserDto>;
  userTemp?: Maybe<UserTempDto>;
  registerToken?: Maybe<Scalars['String']>;
};

export type UserAuthInputDto = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserDto = {
  __typename?: 'UserDto';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  adEmail: Scalars['String'];
  password: Scalars['String'];
  projects: Array<ProjectDto>;
  groups: Array<GroupDto>;
  roles: Array<RoleDto>;
  permissions: Array<PermissionStateDto>;
};

export type UsersFilter = {
  id?: Maybe<Scalars['Float']>;
  email?: Maybe<Scalars['String']>;
  adEmail?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UserTempDto = {
  __typename?: 'UserTempDto';
  name: Scalars['String'];
  email: Scalars['String'];
};

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['Float'];
}>;


export type AcceptInvitationMutation = (
  { __typename?: 'Mutation' }
  & { acceptInvitation: (
    { __typename?: 'InvitationDto' }
    & Pick<InvitationDto, 'id'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id'>
    ) }
  ) }
);

export type BaseUsersQueryVariables = Exact<{
  roles?: Maybe<Array<Scalars['Float']>>;
  rolesSlug?: Maybe<Array<Scalars['String']>>;
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  groups?: Maybe<Array<Scalars['Float']>>;
}>;


export type BaseUsersQuery = (
  { __typename?: 'Query' }
  & { baseUsers: Array<(
    { __typename?: 'BaseUserDto' }
    & Pick<BaseUserDto, 'id' | 'name'>
    & { groups: Array<(
      { __typename?: 'GroupDto' }
      & Pick<GroupDto, 'id' | 'name'>
    )>, roles: Array<(
      { __typename?: 'RoleDto' }
      & Pick<RoleDto, 'id' | 'name'>
    )> }
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  hash: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type ClaimProjectMutationVariables = Exact<{
  projectId: Scalars['Float'];
}>;


export type ClaimProjectMutation = (
  { __typename?: 'Mutation' }
  & { claimProject: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id'>
    & { users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  ) }
);

export type ClassificationsQueryVariables = Exact<{
  users?: Maybe<Array<Scalars['Float']>>;
  projects?: Maybe<Array<Scalars['Float']>>;
  fromDate?: Maybe<Scalars['DateTime']>;
  toDate?: Maybe<Scalars['DateTime']>;
}>;


export type ClassificationsQuery = (
  { __typename?: 'Query' }
  & { classifications: Array<(
    { __typename?: 'ClassificationDto' }
    & Pick<ClassificationDto, 'id' | 'mark' | 'note' | 'createdAt'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name'>
      & { users: Array<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    ), user: (
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    ) }
  )> }
);

export type CreateClassificationMutationVariables = Exact<{
  mark: Scalars['Float'];
  note?: Maybe<Scalars['String']>;
  project: Scalars['Float'];
  user: Scalars['Float'];
}>;


export type CreateClassificationMutation = (
  { __typename?: 'Mutation' }
  & { createClassification: (
    { __typename?: 'ClassificationDto' }
    & Pick<ClassificationDto, 'id' | 'mark' | 'note' | 'createdAt'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name'>
      & { users: Array<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    ), user: (
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    ) }
  ) }
);

export type CreatePasswordResetMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type CreatePasswordResetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createPasswordReset'>
);

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name' | 'description'>
    & { users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  ) }
);

export type CreateRoleMutationVariables = Exact<{
  name: Scalars['String'];
  teacher: Scalars['Boolean'];
  student: Scalars['Boolean'];
  permissions?: Maybe<Array<Scalars['String']>>;
}>;


export type CreateRoleMutation = (
  { __typename?: 'Mutation' }
  & { createRole: (
    { __typename?: 'RoleDto' }
    & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
    & { permissions: Array<(
      { __typename?: 'PermissionDto' }
      & Pick<PermissionDto, 'name' | 'slug'>
    )> }
  ) }
);

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate: Scalars['DateTime'];
  project: Scalars['Float'];
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'TaskDto' }
    & Pick<TaskDto, 'id' | 'name' | 'description' | 'completed' | 'createdAt' | 'dueDate'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name' | 'description'>
      & { tasks: Array<(
        { __typename?: 'TaskDto' }
        & Pick<TaskDto, 'id' | 'name' | 'description' | 'createdAt' | 'dueDate' | 'completed'>
      )> }
    ) }
  ) }
);

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
  adEmail?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  roleSlugs?: Maybe<Array<Scalars['String']>>;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id' | 'name' | 'adEmail' | 'email'>
    & { groups: Array<(
      { __typename?: 'GroupDto' }
      & Pick<GroupDto, 'id' | 'name'>
    )>, roles: Array<(
      { __typename?: 'RoleDto' }
      & Pick<RoleDto, 'id' | 'name' | 'slug' | 'admin'>
    )> }
  ) }
);

export type DeleteClassificationMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteClassificationMutation = (
  { __typename?: 'Mutation' }
  & { deleteClassification: (
    { __typename?: 'ClassificationDto' }
    & Pick<ClassificationDto, 'id' | 'mark' | 'note' | 'createdAt'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name'>
      & { users: Array<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    ), user: (
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    ) }
  ) }
);

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteGroupMutation = (
  { __typename?: 'Mutation' }
  & { deleteGroup: (
    { __typename?: 'GroupDto' }
    & Pick<GroupDto, 'id' | 'name'>
  ) }
);

export type DeleteInvitationMutationVariables = Exact<{
  invitationId: Scalars['Float'];
}>;


export type DeleteInvitationMutation = (
  { __typename?: 'Mutation' }
  & { deleteInvitation: (
    { __typename?: 'InvitationDto' }
    & Pick<InvitationDto, 'id'>
  ) }
);

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['Float'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name'>
    & { users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  ) }
);

export type DeleteRoleMutationVariables = Exact<{
  roleId: Scalars['Float'];
}>;


export type DeleteRoleMutation = (
  { __typename?: 'Mutation' }
  & { deleteRole: (
    { __typename?: 'RoleDto' }
    & Pick<RoleDto, 'id'>
  ) }
);

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask: (
    { __typename?: 'TaskDto' }
    & Pick<TaskDto, 'id' | 'name'>
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id'>
  ) }
);

export type GroupsQueryVariables = Exact<{
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
}>;


export type GroupsQuery = (
  { __typename?: 'Query' }
  & { groups: Array<(
    { __typename?: 'GroupDto' }
    & Pick<GroupDto, 'id' | 'name' | 'usersCount'>
  )> }
);

export type InvitationsQueryVariables = Exact<{
  projectId: Scalars['Float'];
}>;


export type InvitationsQuery = (
  { __typename?: 'Query' }
  & { invitations: Array<(
    { __typename?: 'InvitationDto' }
    & Pick<InvitationDto, 'id' | 'createdAt'>
    & { user: (
      { __typename?: 'BaseUserDto' }
      & Pick<BaseUserDto, 'id' | 'name'>
    ), invited: (
      { __typename?: 'BaseUserDto' }
      & Pick<BaseUserDto, 'id' | 'name'>
    ) }
  )> }
);

export type InviteMutationVariables = Exact<{
  email: Scalars['String'];
  projectId: Scalars['ID'];
}>;


export type InviteMutation = (
  { __typename?: 'Mutation' }
  & { invite: (
    { __typename?: 'InvitationDto' }
    & Pick<InvitationDto, 'id'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'UserAuthDto' }
    & { user?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
      & { roles: Array<(
        { __typename?: 'RoleDto' }
        & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
      )> }
    )> }
  )> }
);

export type MyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInvitationsQuery = (
  { __typename?: 'Query' }
  & { myInvitations: Array<(
    { __typename?: 'InvitationDto' }
    & Pick<InvitationDto, 'id' | 'createdAt'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name'>
      & { users: Array<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    ), user: (
      { __typename?: 'BaseUserDto' }
      & Pick<BaseUserDto, 'id' | 'name'>
    ) }
  )> }
);

export type MyPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPermissionsQuery = (
  { __typename?: 'Query' }
  & { myPermissions: Array<(
    { __typename?: 'PermissionStateDto' }
    & Pick<PermissionStateDto, 'slug' | 'permitted'>
  )> }
);

export type PasswordResetQueryVariables = Exact<{
  hash: Scalars['String'];
}>;


export type PasswordResetQuery = (
  { __typename?: 'Query' }
  & { passwordReset: (
    { __typename?: 'PasswordResetDto' }
    & Pick<PasswordResetDto, 'id' | 'hash'>
  ) }
);

export type PermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PermissionsQuery = (
  { __typename?: 'Query' }
  & { permissions: Array<(
    { __typename?: 'PermissionDto' }
    & Pick<PermissionDto, 'id' | 'name' | 'slug'>
  )> }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name' | 'description' | 'createdAt'>
    & { tasks: Array<(
      { __typename?: 'TaskDto' }
      & Pick<TaskDto, 'id' | 'name' | 'description' | 'createdAt' | 'dueDate' | 'completed'>
    )>, classifications: Array<(
      { __typename?: 'ClassificationDto' }
      & Pick<ClassificationDto, 'id' | 'createdAt' | 'mark' | 'note'>
      & { user: (
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      ) }
    )>, users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  ) }
);

export type ProjectDetailsQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectDetailsQuery = (
  { __typename?: 'Query' }
  & { projectDetails: (
    { __typename?: 'ProjectDetailsDto' }
    & Pick<ProjectDetailsDto, 'isOwner' | 'isAuthor'>
  ) }
);

export type ProjectTasksQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectTasksQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name' | 'description'>
    & { tasks: Array<(
      { __typename?: 'TaskDto' }
      & Pick<TaskDto, 'id' | 'name' | 'description' | 'createdAt' | 'dueDate' | 'completed'>
    )> }
  ) }
);

export type ProjectsQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  authors?: Maybe<Array<Scalars['Float']>>;
  supervisors?: Maybe<Array<Scalars['Float']>>;
}>;


export type ProjectsQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name' | 'description' | 'createdAt'>
    & { users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  )> }
);

export type RolesQueryVariables = Exact<{
  admin?: Maybe<Scalars['Boolean']>;
  permission?: Maybe<Scalars['String']>;
}>;


export type RolesQuery = (
  { __typename?: 'Query' }
  & { roles: Array<(
    { __typename?: 'RoleDto' }
    & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
    & { permissions: Array<(
      { __typename?: 'PermissionDto' }
      & Pick<PermissionDto, 'name' | 'slug'>
    )> }
  )> }
);

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signin: (
    { __typename?: 'UserAuthDto' }
    & Pick<UserAuthDto, 'accessToken' | 'registerToken'>
    & { user?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
      & { roles: Array<(
        { __typename?: 'RoleDto' }
        & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
      )> }
    )>, userTemp?: Maybe<(
      { __typename?: 'UserTempDto' }
      & Pick<UserTempDto, 'name' | 'email'>
    )> }
  ) }
);

export type SignUpMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'UserAuthDto' }
    & Pick<UserAuthDto, 'accessToken'>
    & { user?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
      & { roles: Array<(
        { __typename?: 'RoleDto' }
        & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
      )> }
    )> }
  ) }
);

export type TaskQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type TaskQuery = (
  { __typename?: 'Query' }
  & { task: (
    { __typename?: 'TaskDto' }
    & Pick<TaskDto, 'id' | 'name' | 'description' | 'dueDate' | 'createdAt' | 'completed'>
  ) }
);

export type ToggleTaskStatusMutationVariables = Exact<{
  id: Scalars['Float'];
  completed: Scalars['Boolean'];
}>;


export type ToggleTaskStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'TaskDto' }
    & Pick<TaskDto, 'id' | 'completed'>
  ) }
);

export type UpdateClassificationMutationVariables = Exact<{
  id: Scalars['Float'];
  mark: Scalars['Float'];
  note: Scalars['String'];
  project: Scalars['Float'];
}>;


export type UpdateClassificationMutation = (
  { __typename?: 'Mutation' }
  & { updateClassification: (
    { __typename?: 'ClassificationDto' }
    & Pick<ClassificationDto, 'id' | 'mark' | 'note' | 'createdAt'>
    & { project: (
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name'>
      & { users: Array<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    ), user: (
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    ) }
  ) }
);

export type UpdateProfileMutationVariables = Exact<{
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  oldPassword?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  passwordAgain?: Maybe<Scalars['String']>;
}>;


export type UpdateProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateProfile: (
    { __typename?: 'UserAuthDto' }
    & { user?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
      & { roles: Array<(
        { __typename?: 'RoleDto' }
        & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
      )> }
    )> }
  ) }
);

export type UpdateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  projectId: Scalars['Float'];
  supervisor?: Maybe<Scalars['Float']>;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'ProjectDto' }
    & Pick<ProjectDto, 'id' | 'name' | 'description'>
    & { users: Array<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id'>
    )>, supervisor?: Maybe<(
      { __typename?: 'UserDto' }
      & Pick<UserDto, 'id' | 'name'>
    )> }
  ) }
);

export type UpdateRoleMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  teacher: Scalars['Boolean'];
  student: Scalars['Boolean'];
  permissions?: Maybe<Array<Scalars['String']>>;
}>;


export type UpdateRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateRole: (
    { __typename?: 'RoleDto' }
    & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
    & { permissions: Array<(
      { __typename?: 'PermissionDto' }
      & Pick<PermissionDto, 'name' | 'slug'>
    )> }
  ) }
);

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate: Scalars['DateTime'];
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'TaskDto' }
    & Pick<TaskDto, 'id' | 'name' | 'description' | 'dueDate' | 'createdAt' | 'completed'>
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  roleSlugs?: Maybe<Array<Scalars['String']>>;
  groups?: Maybe<Array<Scalars['Float']>>;
  userId: Scalars['Float'];
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id' | 'name' | 'adEmail' | 'email'>
    & { groups: Array<(
      { __typename?: 'GroupDto' }
      & Pick<GroupDto, 'id' | 'name'>
    )>, roles: Array<(
      { __typename?: 'RoleDto' }
      & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
    )> }
  ) }
);

export type UserQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
    & { groups: Array<(
      { __typename?: 'GroupDto' }
      & Pick<GroupDto, 'id' | 'name'>
    )>, roles: Array<(
      { __typename?: 'RoleDto' }
      & Pick<RoleDto, 'id' | 'name'>
    )>, projects: Array<(
      { __typename?: 'ProjectDto' }
      & Pick<ProjectDto, 'id' | 'name' | 'description'>
      & { supervisor?: Maybe<(
        { __typename?: 'UserDto' }
        & Pick<UserDto, 'id' | 'name'>
      )> }
    )> }
  ) }
);

export type UsersQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  adEmail?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Scalars['Float']>>;
  rolesSlug?: Maybe<Array<Scalars['String']>>;
  admin?: Maybe<Scalars['Boolean']>;
  teacher?: Maybe<Scalars['Boolean']>;
  student?: Maybe<Scalars['Boolean']>;
  groups?: Maybe<Array<Scalars['Float']>>;
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserDto' }
    & Pick<UserDto, 'id' | 'name' | 'email' | 'adEmail'>
    & { groups: Array<(
      { __typename?: 'GroupDto' }
      & Pick<GroupDto, 'id' | 'name'>
    )>, roles: Array<(
      { __typename?: 'RoleDto' }
      & Pick<RoleDto, 'id' | 'name' | 'slug' | 'system' | 'admin' | 'teacher' | 'student'>
    )> }
  )> }
);


export const AcceptInvitationDocument = gql`
    mutation AcceptInvitation($invitationId: Float!) {
  acceptInvitation(invitationId: $invitationId) {
    id
    project {
      id
    }
  }
}
    `;
export type AcceptInvitationMutationFn = Apollo.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        return Apollo.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, baseOptions);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = Apollo.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const BaseUsersDocument = gql`
    query BaseUsers($roles: [Float!], $rolesSlug: [String!], $admin: Boolean, $teacher: Boolean, $student: Boolean, $groups: [Float!]) {
  baseUsers(filter: {roles: $roles, rolesSlug: $rolesSlug, admin: $admin, teacher: $teacher, student: $student, groups: $groups}) {
    id
    name
    groups {
      id
      name
    }
    roles {
      id
      name
    }
  }
}
    `;

/**
 * __useBaseUsersQuery__
 *
 * To run a query within a React component, call `useBaseUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useBaseUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBaseUsersQuery({
 *   variables: {
 *      roles: // value for 'roles'
 *      rolesSlug: // value for 'rolesSlug'
 *      admin: // value for 'admin'
 *      teacher: // value for 'teacher'
 *      student: // value for 'student'
 *      groups: // value for 'groups'
 *   },
 * });
 */
export function useBaseUsersQuery(baseOptions?: Apollo.QueryHookOptions<BaseUsersQuery, BaseUsersQueryVariables>) {
        return Apollo.useQuery<BaseUsersQuery, BaseUsersQueryVariables>(BaseUsersDocument, baseOptions);
      }
export function useBaseUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BaseUsersQuery, BaseUsersQueryVariables>) {
          return Apollo.useLazyQuery<BaseUsersQuery, BaseUsersQueryVariables>(BaseUsersDocument, baseOptions);
        }
export type BaseUsersQueryHookResult = ReturnType<typeof useBaseUsersQuery>;
export type BaseUsersLazyQueryHookResult = ReturnType<typeof useBaseUsersLazyQuery>;
export type BaseUsersQueryResult = Apollo.QueryResult<BaseUsersQuery, BaseUsersQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($hash: String!, $password: String!) {
  changePassword(hash: $hash, password: $password)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      hash: // value for 'hash'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ClaimProjectDocument = gql`
    mutation ClaimProject($projectId: Float!) {
  claimProject(filter: {id: $projectId}) {
    id
    users {
      id
      name
    }
    supervisor {
      id
      name
    }
  }
}
    `;
export type ClaimProjectMutationFn = Apollo.MutationFunction<ClaimProjectMutation, ClaimProjectMutationVariables>;

/**
 * __useClaimProjectMutation__
 *
 * To run a mutation, you first call `useClaimProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimProjectMutation, { data, loading, error }] = useClaimProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useClaimProjectMutation(baseOptions?: Apollo.MutationHookOptions<ClaimProjectMutation, ClaimProjectMutationVariables>) {
        return Apollo.useMutation<ClaimProjectMutation, ClaimProjectMutationVariables>(ClaimProjectDocument, baseOptions);
      }
export type ClaimProjectMutationHookResult = ReturnType<typeof useClaimProjectMutation>;
export type ClaimProjectMutationResult = Apollo.MutationResult<ClaimProjectMutation>;
export type ClaimProjectMutationOptions = Apollo.BaseMutationOptions<ClaimProjectMutation, ClaimProjectMutationVariables>;
export const ClassificationsDocument = gql`
    query Classifications($users: [Float!], $projects: [Float!], $fromDate: DateTime, $toDate: DateTime) {
  classifications(filter: {users: $users, projects: $projects, fromDate: $fromDate, toDate: $toDate}) {
    id
    mark
    note
    project {
      id
      name
      users {
        id
        name
      }
    }
    createdAt
    user {
      id
      name
    }
  }
}
    `;

/**
 * __useClassificationsQuery__
 *
 * To run a query within a React component, call `useClassificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassificationsQuery({
 *   variables: {
 *      users: // value for 'users'
 *      projects: // value for 'projects'
 *      fromDate: // value for 'fromDate'
 *      toDate: // value for 'toDate'
 *   },
 * });
 */
export function useClassificationsQuery(baseOptions?: Apollo.QueryHookOptions<ClassificationsQuery, ClassificationsQueryVariables>) {
        return Apollo.useQuery<ClassificationsQuery, ClassificationsQueryVariables>(ClassificationsDocument, baseOptions);
      }
export function useClassificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassificationsQuery, ClassificationsQueryVariables>) {
          return Apollo.useLazyQuery<ClassificationsQuery, ClassificationsQueryVariables>(ClassificationsDocument, baseOptions);
        }
export type ClassificationsQueryHookResult = ReturnType<typeof useClassificationsQuery>;
export type ClassificationsLazyQueryHookResult = ReturnType<typeof useClassificationsLazyQuery>;
export type ClassificationsQueryResult = Apollo.QueryResult<ClassificationsQuery, ClassificationsQueryVariables>;
export const CreateClassificationDocument = gql`
    mutation CreateClassification($mark: Float!, $note: String, $project: Float!, $user: Float!) {
  createClassification(input: {mark: $mark, note: $note, project: $project, user: $user}) {
    id
    mark
    note
    project {
      id
      name
      users {
        id
        name
      }
    }
    createdAt
    user {
      id
      name
    }
  }
}
    `;
export type CreateClassificationMutationFn = Apollo.MutationFunction<CreateClassificationMutation, CreateClassificationMutationVariables>;

/**
 * __useCreateClassificationMutation__
 *
 * To run a mutation, you first call `useCreateClassificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClassificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClassificationMutation, { data, loading, error }] = useCreateClassificationMutation({
 *   variables: {
 *      mark: // value for 'mark'
 *      note: // value for 'note'
 *      project: // value for 'project'
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateClassificationMutation(baseOptions?: Apollo.MutationHookOptions<CreateClassificationMutation, CreateClassificationMutationVariables>) {
        return Apollo.useMutation<CreateClassificationMutation, CreateClassificationMutationVariables>(CreateClassificationDocument, baseOptions);
      }
export type CreateClassificationMutationHookResult = ReturnType<typeof useCreateClassificationMutation>;
export type CreateClassificationMutationResult = Apollo.MutationResult<CreateClassificationMutation>;
export type CreateClassificationMutationOptions = Apollo.BaseMutationOptions<CreateClassificationMutation, CreateClassificationMutationVariables>;
export const CreatePasswordResetDocument = gql`
    mutation CreatePasswordReset($email: String!) {
  createPasswordReset(input: {email: $email})
}
    `;
export type CreatePasswordResetMutationFn = Apollo.MutationFunction<CreatePasswordResetMutation, CreatePasswordResetMutationVariables>;

/**
 * __useCreatePasswordResetMutation__
 *
 * To run a mutation, you first call `useCreatePasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPasswordResetMutation, { data, loading, error }] = useCreatePasswordResetMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCreatePasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<CreatePasswordResetMutation, CreatePasswordResetMutationVariables>) {
        return Apollo.useMutation<CreatePasswordResetMutation, CreatePasswordResetMutationVariables>(CreatePasswordResetDocument, baseOptions);
      }
export type CreatePasswordResetMutationHookResult = ReturnType<typeof useCreatePasswordResetMutation>;
export type CreatePasswordResetMutationResult = Apollo.MutationResult<CreatePasswordResetMutation>;
export type CreatePasswordResetMutationOptions = Apollo.BaseMutationOptions<CreatePasswordResetMutation, CreatePasswordResetMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($name: String!, $description: String) {
  createProject(input: {name: $name, description: $description}) {
    id
    name
    description
    users {
      id
      name
    }
    supervisor {
      id
      name
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($name: String!, $teacher: Boolean!, $student: Boolean!, $permissions: [String!]) {
  createRole(input: {name: $name, teacher: $teacher, student: $student, permissionSlugs: $permissions}) {
    id
    name
    slug
    system
    admin
    teacher
    student
    permissions {
      name
      slug
    }
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      name: // value for 'name'
 *      teacher: // value for 'teacher'
 *      student: // value for 'student'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, baseOptions);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($name: String!, $description: String, $dueDate: DateTime!, $project: Float!) {
  createTask(input: {name: $name, description: $description, dueDate: $dueDate, project: $project}) {
    id
    name
    description
    completed
    createdAt
    dueDate
    project {
      id
      name
      description
      tasks {
        id
        name
        description
        createdAt
        dueDate
        completed
      }
    }
  }
}
    `;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      dueDate: // value for 'dueDate'
 *      project: // value for 'project'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($name: String!, $adEmail: String, $email: String!, $password: String, $roleSlugs: [String!]) {
  createUser(input: {name: $name, adEmail: $adEmail, email: $email, password: $password, roleSlugs: $roleSlugs}) {
    id
    name
    adEmail
    email
    groups {
      id
      name
    }
    roles {
      id
      name
      slug
      admin
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      adEmail: // value for 'adEmail'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      roleSlugs: // value for 'roleSlugs'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteClassificationDocument = gql`
    mutation DeleteClassification($id: Float!) {
  deleteClassification(filter: {id: $id}) {
    id
    mark
    note
    project {
      id
      name
      users {
        id
        name
      }
    }
    createdAt
    user {
      id
      name
    }
  }
}
    `;
export type DeleteClassificationMutationFn = Apollo.MutationFunction<DeleteClassificationMutation, DeleteClassificationMutationVariables>;

/**
 * __useDeleteClassificationMutation__
 *
 * To run a mutation, you first call `useDeleteClassificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClassificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClassificationMutation, { data, loading, error }] = useDeleteClassificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteClassificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClassificationMutation, DeleteClassificationMutationVariables>) {
        return Apollo.useMutation<DeleteClassificationMutation, DeleteClassificationMutationVariables>(DeleteClassificationDocument, baseOptions);
      }
export type DeleteClassificationMutationHookResult = ReturnType<typeof useDeleteClassificationMutation>;
export type DeleteClassificationMutationResult = Apollo.MutationResult<DeleteClassificationMutation>;
export type DeleteClassificationMutationOptions = Apollo.BaseMutationOptions<DeleteClassificationMutation, DeleteClassificationMutationVariables>;
export const DeleteGroupDocument = gql`
    mutation DeleteGroup($id: Float!) {
  deleteGroup(groupId: $id) {
    id
    name
  }
}
    `;
export type DeleteGroupMutationFn = Apollo.MutationFunction<DeleteGroupMutation, DeleteGroupMutationVariables>;

/**
 * __useDeleteGroupMutation__
 *
 * To run a mutation, you first call `useDeleteGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGroupMutation, { data, loading, error }] = useDeleteGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGroupMutation, DeleteGroupMutationVariables>) {
        return Apollo.useMutation<DeleteGroupMutation, DeleteGroupMutationVariables>(DeleteGroupDocument, baseOptions);
      }
export type DeleteGroupMutationHookResult = ReturnType<typeof useDeleteGroupMutation>;
export type DeleteGroupMutationResult = Apollo.MutationResult<DeleteGroupMutation>;
export type DeleteGroupMutationOptions = Apollo.BaseMutationOptions<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const DeleteInvitationDocument = gql`
    mutation DeleteInvitation($invitationId: Float!) {
  deleteInvitation(invitationId: $invitationId) {
    id
  }
}
    `;
export type DeleteInvitationMutationFn = Apollo.MutationFunction<DeleteInvitationMutation, DeleteInvitationMutationVariables>;

/**
 * __useDeleteInvitationMutation__
 *
 * To run a mutation, you first call `useDeleteInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvitationMutation, { data, loading, error }] = useDeleteInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *   },
 * });
 */
export function useDeleteInvitationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvitationMutation, DeleteInvitationMutationVariables>) {
        return Apollo.useMutation<DeleteInvitationMutation, DeleteInvitationMutationVariables>(DeleteInvitationDocument, baseOptions);
      }
export type DeleteInvitationMutationHookResult = ReturnType<typeof useDeleteInvitationMutation>;
export type DeleteInvitationMutationResult = Apollo.MutationResult<DeleteInvitationMutation>;
export type DeleteInvitationMutationOptions = Apollo.BaseMutationOptions<DeleteInvitationMutation, DeleteInvitationMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectId: Float!) {
  deleteProject(projectId: $projectId) {
    id
    name
    users {
      id
      name
    }
    supervisor {
      id
      name
    }
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($roleId: Float!) {
  deleteRole(roleId: $roleId) {
    id
  }
}
    `;
export type DeleteRoleMutationFn = Apollo.MutationFunction<DeleteRoleMutation, DeleteRoleMutationVariables>;

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoleMutation, { data, loading, error }] = useDeleteRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useDeleteRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, baseOptions);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: Float!) {
  deleteTask(filter: {id: $id}) {
    id
    name
  }
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, baseOptions);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: Float!) {
  deleteUser(userId: $id) {
    id
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, baseOptions);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const GroupsDocument = gql`
    query Groups($id: Float, $name: String, $order: String) {
  groups(filter: {id: $id, name: $name, order: $order}) {
    id
    name
    usersCount
  }
}
    `;

/**
 * __useGroupsQuery__
 *
 * To run a query within a React component, call `useGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
        return Apollo.useQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, baseOptions);
      }
export function useGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
          return Apollo.useLazyQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, baseOptions);
        }
export type GroupsQueryHookResult = ReturnType<typeof useGroupsQuery>;
export type GroupsLazyQueryHookResult = ReturnType<typeof useGroupsLazyQuery>;
export type GroupsQueryResult = Apollo.QueryResult<GroupsQuery, GroupsQueryVariables>;
export const InvitationsDocument = gql`
    query Invitations($projectId: Float!) {
  invitations(projectId: $projectId) {
    id
    user {
      id
      name
    }
    invited {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useInvitationsQuery__
 *
 * To run a query within a React component, call `useInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvitationsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useInvitationsQuery(baseOptions: Apollo.QueryHookOptions<InvitationsQuery, InvitationsQueryVariables>) {
        return Apollo.useQuery<InvitationsQuery, InvitationsQueryVariables>(InvitationsDocument, baseOptions);
      }
export function useInvitationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvitationsQuery, InvitationsQueryVariables>) {
          return Apollo.useLazyQuery<InvitationsQuery, InvitationsQueryVariables>(InvitationsDocument, baseOptions);
        }
export type InvitationsQueryHookResult = ReturnType<typeof useInvitationsQuery>;
export type InvitationsLazyQueryHookResult = ReturnType<typeof useInvitationsLazyQuery>;
export type InvitationsQueryResult = Apollo.QueryResult<InvitationsQuery, InvitationsQueryVariables>;
export const InviteDocument = gql`
    mutation Invite($email: String!, $projectId: ID!) {
  invite(input: {email: $email, project: $projectId}) {
    id
  }
}
    `;
export type InviteMutationFn = Apollo.MutationFunction<InviteMutation, InviteMutationVariables>;

/**
 * __useInviteMutation__
 *
 * To run a mutation, you first call `useInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMutation, { data, loading, error }] = useInviteMutation({
 *   variables: {
 *      email: // value for 'email'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useInviteMutation(baseOptions?: Apollo.MutationHookOptions<InviteMutation, InviteMutationVariables>) {
        return Apollo.useMutation<InviteMutation, InviteMutationVariables>(InviteDocument, baseOptions);
      }
export type InviteMutationHookResult = ReturnType<typeof useInviteMutation>;
export type InviteMutationResult = Apollo.MutationResult<InviteMutation>;
export type InviteMutationOptions = Apollo.BaseMutationOptions<InviteMutation, InviteMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    user {
      id
      name
      email
      adEmail
      roles {
        id
        name
        slug
        system
        admin
        teacher
        student
      }
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyInvitationsDocument = gql`
    query MyInvitations {
  myInvitations {
    id
    project {
      id
      name
      users {
        id
        name
      }
    }
    user {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useMyInvitationsQuery__
 *
 * To run a query within a React component, call `useMyInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyInvitationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyInvitationsQuery(baseOptions?: Apollo.QueryHookOptions<MyInvitationsQuery, MyInvitationsQueryVariables>) {
        return Apollo.useQuery<MyInvitationsQuery, MyInvitationsQueryVariables>(MyInvitationsDocument, baseOptions);
      }
export function useMyInvitationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyInvitationsQuery, MyInvitationsQueryVariables>) {
          return Apollo.useLazyQuery<MyInvitationsQuery, MyInvitationsQueryVariables>(MyInvitationsDocument, baseOptions);
        }
export type MyInvitationsQueryHookResult = ReturnType<typeof useMyInvitationsQuery>;
export type MyInvitationsLazyQueryHookResult = ReturnType<typeof useMyInvitationsLazyQuery>;
export type MyInvitationsQueryResult = Apollo.QueryResult<MyInvitationsQuery, MyInvitationsQueryVariables>;
export const MyPermissionsDocument = gql`
    query MyPermissions {
  myPermissions {
    slug
    permitted
  }
}
    `;

/**
 * __useMyPermissionsQuery__
 *
 * To run a query within a React component, call `useMyPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyPermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<MyPermissionsQuery, MyPermissionsQueryVariables>) {
        return Apollo.useQuery<MyPermissionsQuery, MyPermissionsQueryVariables>(MyPermissionsDocument, baseOptions);
      }
export function useMyPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyPermissionsQuery, MyPermissionsQueryVariables>) {
          return Apollo.useLazyQuery<MyPermissionsQuery, MyPermissionsQueryVariables>(MyPermissionsDocument, baseOptions);
        }
export type MyPermissionsQueryHookResult = ReturnType<typeof useMyPermissionsQuery>;
export type MyPermissionsLazyQueryHookResult = ReturnType<typeof useMyPermissionsLazyQuery>;
export type MyPermissionsQueryResult = Apollo.QueryResult<MyPermissionsQuery, MyPermissionsQueryVariables>;
export const PasswordResetDocument = gql`
    query PasswordReset($hash: String!) {
  passwordReset(hash: $hash) {
    id
    hash
  }
}
    `;

/**
 * __usePasswordResetQuery__
 *
 * To run a query within a React component, call `usePasswordResetQuery` and pass it any options that fit your needs.
 * When your component renders, `usePasswordResetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePasswordResetQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function usePasswordResetQuery(baseOptions: Apollo.QueryHookOptions<PasswordResetQuery, PasswordResetQueryVariables>) {
        return Apollo.useQuery<PasswordResetQuery, PasswordResetQueryVariables>(PasswordResetDocument, baseOptions);
      }
export function usePasswordResetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PasswordResetQuery, PasswordResetQueryVariables>) {
          return Apollo.useLazyQuery<PasswordResetQuery, PasswordResetQueryVariables>(PasswordResetDocument, baseOptions);
        }
export type PasswordResetQueryHookResult = ReturnType<typeof usePasswordResetQuery>;
export type PasswordResetLazyQueryHookResult = ReturnType<typeof usePasswordResetLazyQuery>;
export type PasswordResetQueryResult = Apollo.QueryResult<PasswordResetQuery, PasswordResetQueryVariables>;
export const PermissionsDocument = gql`
    query Permissions {
  permissions {
    id
    name
    slug
  }
}
    `;

/**
 * __usePermissionsQuery__
 *
 * To run a query within a React component, call `usePermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePermissionsQuery(baseOptions?: Apollo.QueryHookOptions<PermissionsQuery, PermissionsQueryVariables>) {
        return Apollo.useQuery<PermissionsQuery, PermissionsQueryVariables>(PermissionsDocument, baseOptions);
      }
export function usePermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PermissionsQuery, PermissionsQueryVariables>) {
          return Apollo.useLazyQuery<PermissionsQuery, PermissionsQueryVariables>(PermissionsDocument, baseOptions);
        }
export type PermissionsQueryHookResult = ReturnType<typeof usePermissionsQuery>;
export type PermissionsLazyQueryHookResult = ReturnType<typeof usePermissionsLazyQuery>;
export type PermissionsQueryResult = Apollo.QueryResult<PermissionsQuery, PermissionsQueryVariables>;
export const ProjectDocument = gql`
    query Project($id: Float!) {
  project(projectId: $id) {
    id
    name
    description
    createdAt
    tasks {
      id
      name
      description
      createdAt
      dueDate
      completed
    }
    classifications {
      id
      createdAt
      mark
      note
      user {
        id
        name
      }
    }
    users {
      id
      name
    }
    supervisor {
      id
      name
    }
  }
}
    `;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectQuery(baseOptions: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const ProjectDetailsDocument = gql`
    query ProjectDetails($id: Float!) {
  projectDetails(projectId: $id) {
    isOwner
    isAuthor
  }
}
    `;

/**
 * __useProjectDetailsQuery__
 *
 * To run a query within a React component, call `useProjectDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectDetailsQuery(baseOptions: Apollo.QueryHookOptions<ProjectDetailsQuery, ProjectDetailsQueryVariables>) {
        return Apollo.useQuery<ProjectDetailsQuery, ProjectDetailsQueryVariables>(ProjectDetailsDocument, baseOptions);
      }
export function useProjectDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectDetailsQuery, ProjectDetailsQueryVariables>) {
          return Apollo.useLazyQuery<ProjectDetailsQuery, ProjectDetailsQueryVariables>(ProjectDetailsDocument, baseOptions);
        }
export type ProjectDetailsQueryHookResult = ReturnType<typeof useProjectDetailsQuery>;
export type ProjectDetailsLazyQueryHookResult = ReturnType<typeof useProjectDetailsLazyQuery>;
export type ProjectDetailsQueryResult = Apollo.QueryResult<ProjectDetailsQuery, ProjectDetailsQueryVariables>;
export const ProjectTasksDocument = gql`
    query ProjectTasks($id: Float!) {
  project(projectId: $id) {
    id
    name
    description
    tasks {
      id
      name
      description
      createdAt
      dueDate
      completed
    }
  }
}
    `;

/**
 * __useProjectTasksQuery__
 *
 * To run a query within a React component, call `useProjectTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectTasksQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectTasksQuery(baseOptions: Apollo.QueryHookOptions<ProjectTasksQuery, ProjectTasksQueryVariables>) {
        return Apollo.useQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, baseOptions);
      }
export function useProjectTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectTasksQuery, ProjectTasksQueryVariables>) {
          return Apollo.useLazyQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, baseOptions);
        }
export type ProjectTasksQueryHookResult = ReturnType<typeof useProjectTasksQuery>;
export type ProjectTasksLazyQueryHookResult = ReturnType<typeof useProjectTasksLazyQuery>;
export type ProjectTasksQueryResult = Apollo.QueryResult<ProjectTasksQuery, ProjectTasksQueryVariables>;
export const ProjectsDocument = gql`
    query Projects($name: String, $authors: [Float!], $supervisors: [Float!]) {
  projects(filter: {name: $name, authors: $authors, supervisors: $supervisors}) {
    id
    name
    description
    createdAt
    users {
      id
      name
    }
    supervisor {
      id
      name
    }
  }
}
    `;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      authors: // value for 'authors'
 *      supervisors: // value for 'supervisors'
 *   },
 * });
 */
export function useProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
        return Apollo.useQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, baseOptions);
      }
export function useProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
          return Apollo.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, baseOptions);
        }
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<typeof useProjectsLazyQuery>;
export type ProjectsQueryResult = Apollo.QueryResult<ProjectsQuery, ProjectsQueryVariables>;
export const RolesDocument = gql`
    query Roles($admin: Boolean, $permission: String) {
  roles(filter: {admin: $admin, permission: $permission}) {
    id
    name
    slug
    system
    admin
    teacher
    student
    permissions {
      name
      slug
    }
  }
}
    `;

/**
 * __useRolesQuery__
 *
 * To run a query within a React component, call `useRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRolesQuery({
 *   variables: {
 *      admin: // value for 'admin'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useRolesQuery(baseOptions?: Apollo.QueryHookOptions<RolesQuery, RolesQueryVariables>) {
        return Apollo.useQuery<RolesQuery, RolesQueryVariables>(RolesDocument, baseOptions);
      }
export function useRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RolesQuery, RolesQueryVariables>) {
          return Apollo.useLazyQuery<RolesQuery, RolesQueryVariables>(RolesDocument, baseOptions);
        }
export type RolesQueryHookResult = ReturnType<typeof useRolesQuery>;
export type RolesLazyQueryHookResult = ReturnType<typeof useRolesLazyQuery>;
export type RolesQueryResult = Apollo.QueryResult<RolesQuery, RolesQueryVariables>;
export const SignInDocument = gql`
    mutation SignIn($email: String!, $password: String!) {
  signin(auth: {email: $email, password: $password}) {
    accessToken
    user {
      id
      name
      email
      adEmail
      roles {
        id
        name
        slug
        system
        admin
        teacher
        student
      }
    }
    userTemp {
      name
      email
    }
    registerToken
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($name: String, $email: String, $password: String) {
  signup(input: {name: $name, email: $email, password: $password}) {
    accessToken
    user {
      id
      name
      email
      adEmail
      roles {
        id
        name
        slug
        system
        admin
        teacher
        student
      }
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const TaskDocument = gql`
    query Task($id: Float!) {
  task(filter: {id: $id}) {
    id
    name
    description
    dueDate
    createdAt
    completed
  }
}
    `;

/**
 * __useTaskQuery__
 *
 * To run a query within a React component, call `useTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskQuery(baseOptions: Apollo.QueryHookOptions<TaskQuery, TaskQueryVariables>) {
        return Apollo.useQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
      }
export function useTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskQuery, TaskQueryVariables>) {
          return Apollo.useLazyQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
        }
export type TaskQueryHookResult = ReturnType<typeof useTaskQuery>;
export type TaskLazyQueryHookResult = ReturnType<typeof useTaskLazyQuery>;
export type TaskQueryResult = Apollo.QueryResult<TaskQuery, TaskQueryVariables>;
export const ToggleTaskStatusDocument = gql`
    mutation ToggleTaskStatus($id: Float!, $completed: Boolean!) {
  updateTask(filter: {id: $id}, updates: {completed: $completed}) {
    id
    completed
  }
}
    `;
export type ToggleTaskStatusMutationFn = Apollo.MutationFunction<ToggleTaskStatusMutation, ToggleTaskStatusMutationVariables>;

/**
 * __useToggleTaskStatusMutation__
 *
 * To run a mutation, you first call `useToggleTaskStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTaskStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTaskStatusMutation, { data, loading, error }] = useToggleTaskStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      completed: // value for 'completed'
 *   },
 * });
 */
export function useToggleTaskStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTaskStatusMutation, ToggleTaskStatusMutationVariables>) {
        return Apollo.useMutation<ToggleTaskStatusMutation, ToggleTaskStatusMutationVariables>(ToggleTaskStatusDocument, baseOptions);
      }
export type ToggleTaskStatusMutationHookResult = ReturnType<typeof useToggleTaskStatusMutation>;
export type ToggleTaskStatusMutationResult = Apollo.MutationResult<ToggleTaskStatusMutation>;
export type ToggleTaskStatusMutationOptions = Apollo.BaseMutationOptions<ToggleTaskStatusMutation, ToggleTaskStatusMutationVariables>;
export const UpdateClassificationDocument = gql`
    mutation UpdateClassification($id: Float!, $mark: Float!, $note: String!, $project: Float!) {
  updateClassification(filter: {id: $id}, updates: {mark: $mark, note: $note, projectId: $project}) {
    id
    mark
    note
    project {
      id
      name
      users {
        id
        name
      }
    }
    createdAt
    user {
      id
      name
    }
  }
}
    `;
export type UpdateClassificationMutationFn = Apollo.MutationFunction<UpdateClassificationMutation, UpdateClassificationMutationVariables>;

/**
 * __useUpdateClassificationMutation__
 *
 * To run a mutation, you first call `useUpdateClassificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClassificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClassificationMutation, { data, loading, error }] = useUpdateClassificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      mark: // value for 'mark'
 *      note: // value for 'note'
 *      project: // value for 'project'
 *   },
 * });
 */
export function useUpdateClassificationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClassificationMutation, UpdateClassificationMutationVariables>) {
        return Apollo.useMutation<UpdateClassificationMutation, UpdateClassificationMutationVariables>(UpdateClassificationDocument, baseOptions);
      }
export type UpdateClassificationMutationHookResult = ReturnType<typeof useUpdateClassificationMutation>;
export type UpdateClassificationMutationResult = Apollo.MutationResult<UpdateClassificationMutation>;
export type UpdateClassificationMutationOptions = Apollo.BaseMutationOptions<UpdateClassificationMutation, UpdateClassificationMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($name: String!, $email: String, $oldPassword: String, $password: String, $passwordAgain: String) {
  updateProfile(input: {name: $name, email: $email, oldPassword: $oldPassword, password: $password, passwordAgain: $passwordAgain}) {
    user {
      id
      name
      email
      adEmail
      roles {
        id
        name
        slug
        system
        admin
        teacher
        student
      }
    }
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      oldPassword: // value for 'oldPassword'
 *      password: // value for 'password'
 *      passwordAgain: // value for 'passwordAgain'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, baseOptions);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($name: String!, $description: String, $projectId: Float!, $supervisor: Float) {
  updateProject(updates: {name: $name, description: $description, supervisor: $supervisor}, filter: {id: $projectId}) {
    id
    name
    description
    users {
      id
    }
    supervisor {
      id
      name
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      projectId: // value for 'projectId'
 *      supervisor: // value for 'supervisor'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($id: Float!, $name: String!, $teacher: Boolean!, $student: Boolean!, $permissions: [String!]) {
  updateRole(filter: {id: $id}, input: {name: $name, teacher: $teacher, student: $student, permissionSlugs: $permissions}) {
    id
    name
    slug
    system
    admin
    teacher
    student
    permissions {
      name
      slug
    }
  }
}
    `;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      teacher: // value for 'teacher'
 *      student: // value for 'student'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, baseOptions);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: Float!, $name: String!, $description: String, $dueDate: DateTime!) {
  updateTask(filter: {id: $id}, updates: {name: $name, description: $description, dueDate: $dueDate}) {
    id
    name
    description
    dueDate
    createdAt
    completed
  }
}
    `;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      dueDate: // value for 'dueDate'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, baseOptions);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($name: String!, $email: String!, $roleSlugs: [String!], $groups: [Float!], $userId: Float!) {
  updateUser(input: {name: $name, email: $email, roleSlugs: $roleSlugs, groups: $groups}, filter: {id: $userId}) {
    id
    name
    adEmail
    email
    groups {
      id
      name
    }
    roles {
      id
      name
      slug
      system
      admin
      teacher
      student
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      roleSlugs: // value for 'roleSlugs'
 *      groups: // value for 'groups'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UserDocument = gql`
    query User($id: Float!) {
  user(filter: {id: $id}) {
    id
    name
    email
    adEmail
    groups {
      id
      name
    }
    roles {
      id
      name
    }
    projects {
      id
      name
      description
      supervisor {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($name: String, $email: String, $adEmail: String, $roles: [Float!], $rolesSlug: [String!], $admin: Boolean, $teacher: Boolean, $student: Boolean, $groups: [Float!]) {
  users(filter: {name: $name, email: $email, adEmail: $adEmail, roles: $roles, rolesSlug: $rolesSlug, admin: $admin, teacher: $teacher, student: $student, groups: $groups}) {
    id
    name
    email
    adEmail
    groups {
      id
      name
    }
    roles {
      id
      name
      slug
      system
      admin
      teacher
      student
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      adEmail: // value for 'adEmail'
 *      roles: // value for 'roles'
 *      rolesSlug: // value for 'rolesSlug'
 *      admin: // value for 'admin'
 *      teacher: // value for 'teacher'
 *      student: // value for 'student'
 *      groups: // value for 'groups'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;

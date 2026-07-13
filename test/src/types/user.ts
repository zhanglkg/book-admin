// 用户、登录、角色与权限类型

export type UserStatus = 'active' | 'disabled';

/** 登录入参 */
export interface LoginParams {
  username: string;
  password: string;
}

/** 登录返回 */
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

/** 当前登录用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  roleName: string;
  status: UserStatus;
  permissions: string[];
  createdAt: string;
}

/** 会员/用户 */
export interface Member {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'unknown';
  status: UserStatus;
  borrowCount: number;
  createdAt: string;
}

/** 角色 */
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

/** 权限节点（用于权限树） */
export interface PermissionNode {
  key: string;
  label: string;
  children?: PermissionNode[];
}

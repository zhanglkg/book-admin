import request from '@/utils/request';
import type { ApiResponse, PageResult } from '@/types/api';
import type { LoginParams, LoginResult, UserInfo, Role, Member } from '@/types/user';

// 鉴权
export function login(data: LoginParams) {
  return request.post<ApiResponse<LoginResult>>('/auth/login', data).then((r) => r.data.data);
}
export function getProfile() {
  return request.get<ApiResponse<UserInfo>>('/auth/profile').then((r) => r.data.data);
}

// 角色与权限
export function getRoles() {
  return request.get<ApiResponse<Role[]>>('/system/roles').then((r) => r.data.data);
}
export function updateRolePermissions(id: number, permissions: string[]) {
  return request.put<ApiResponse<Role>>(`/system/roles/${id}/permissions`, { permissions }).then((r) => r.data.data);
}

// 会员（用户/读者）
export function getMembers(params: { page?: number; pageSize?: number; keyword?: string; status?: string }) {
  return request.get<ApiResponse<PageResult<Member>>>('/users', { params }).then((r) => r.data.data);
}
export function createMember(data: Partial<Member>) {
  return request.post<ApiResponse<Member>>('/users', data).then((r) => r.data.data);
}
export function updateMember(id: number, data: Partial<Member>) {
  return request.put<ApiResponse<Member>>(`/users/${id}`, data).then((r) => r.data.data);
}
export function deleteMember(id: number) {
  return request.delete<ApiResponse<null>>(`/users/${id}`).then((r) => r.data.data);
}

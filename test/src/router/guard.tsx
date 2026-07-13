import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

/** 私有路由：未登录跳转登录页，并记录来源路径 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

/** 路由级权限校验：无权限跳转 403 */
export function RequirePermission({ permission, children }: { permission?: string; children: ReactNode }) {
  const permissions = useAuthStore((state) => state.permissions);
  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}

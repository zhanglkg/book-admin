import { lazy } from 'react';
import { LayoutDashboard, BookOpen, Tags, Users, BookCopy, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** 菜单/路由元信息：单一数据源，驱动侧边菜单与路由权限 */
export interface MenuRoute {
  /** 路由路径（同时作为菜单 key） */
  path: string;
  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon?: LucideIcon;
  /** 访问所需权限码（未配置则无需权限） */
  permission?: string;
  /** 子菜单 */
  children?: MenuRoute[];
}

export const menuRoutes: MenuRoute[] = [
  { path: '/', title: '数据看板', icon: LayoutDashboard, permission: 'dashboard:view' },
  { path: '/books', title: '图书管理', icon: BookOpen, permission: 'book:view' },
  { path: '/categories', title: '分类管理', icon: Tags, permission: 'category:view' },
  { path: '/users', title: '用户管理', icon: Users, permission: 'user:view' },
  { path: '/borrows', title: '借阅管理', icon: BookCopy, permission: 'borrow:view' },
  {
    path: '/settings',
    title: '系统设置',
    icon: Settings,
    permission: 'system:view',
    children: [
      { path: '/settings/role', title: '角色权限', permission: 'system:role' },
      { path: '/settings/system', title: '系统参数', permission: 'system:view' },
    ],
  },
];

/** 懒加载业务页面（路由级代码分割） */
export const lazyPages = {
  Dashboard: lazy(() => import('@/pages/Dashboard')),
  Books: lazy(() => import('@/pages/Books')),
  Categories: lazy(() => import('@/pages/Categories')),
  Users: lazy(() => import('@/pages/Users')),
  Borrows: lazy(() => import('@/pages/Borrows')),
  RolePermission: lazy(() => import('@/pages/Settings/RolePermission')),
  System: lazy(() => import('@/pages/Settings/System')),
};

import { useMemo, useState, useEffect } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { menuRoutes } from '@/router/routes';
import type { MenuRoute } from '@/router/routes';

interface SideMenuProps {
  collapsed: boolean;
}

export default function SideMenu({ collapsed }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = useAuthStore((state) => state.permissions);

  // 收集仅用于展开子菜单、不可直接跳转的父级路径
  const parentPaths = useMemo(() => {
    const set = new Set<string>();
    menuRoutes.forEach((r) => r.children?.length && set.add(r.path));
    return set;
  }, []);

  const items = useMemo<MenuProps['items']>(() => {
    const build = (routes: MenuRoute[]): MenuProps['items'] =>
      routes
        .filter((r) => !r.permission || permissions.includes(r.permission))
        .map((r) => {
          const Icon = r.icon;
          const icon = Icon ? <Icon size={16} /> : undefined;
          if (r.children) {
            return { key: r.path, icon, label: r.title, children: build(r.children) };
          }
          return { key: r.path, icon, label: r.title };
        });
    return build(menuRoutes);
  }, [permissions]);

  const [openKeys, setOpenKeys] = useState<string[]>(location.pathname.startsWith('/settings') ? ['/settings'] : []);

  useEffect(() => {
    if (location.pathname.startsWith('/settings') && !openKeys.includes('/settings')) {
      setOpenKeys((prev) => [...prev, '/settings']);
    }
  }, [location.pathname, openKeys]);

  const selectedKeys = [location.pathname === '/' ? '/' : location.pathname];

  return (
    <Menu
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={(keys) => setOpenKeys(keys as string[])}
      items={items}
      className="!border-r-0 !bg-transparent"
      onClick={({ key }) => {
        if (parentPaths.has(key)) return;
        navigate(key);
      }}
    />
  );
}

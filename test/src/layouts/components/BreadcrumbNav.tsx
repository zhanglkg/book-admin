import { Breadcrumb } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuRoutes } from '@/router/routes';

export default function BreadcrumbNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const titleMap: Record<string, string> = {};
  const parentMap: Record<string, string> = {};
  menuRoutes.forEach((r) => {
    titleMap[r.path] = r.title;
    r.children?.forEach((c) => {
      titleMap[c.path] = c.title;
      parentMap[c.path] = r.path;
    });
  });

  const items: { title: React.ReactNode }[] = [
    { title: <a onClick={() => navigate('/')}>首页</a> },
  ];
  const parent = parentMap[pathname];
  if (parent) items.push({ title: titleMap[parent] });
  if (pathname !== '/') items.push({ title: titleMap[pathname] ?? '未知页面' });

  return <Breadcrumb items={items} className="mb-4" />;
}

import { Layout, Spin } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import HeaderBar from './components/HeaderBar';
import BreadcrumbNav from './components/BreadcrumbNav';
import { useAppStore } from '@/stores/useAppStore';

const { Sider, Header, Content } = Layout;

export default function BasicLayout() {
  const collapsed = useAppStore((state) => state.collapsed);

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={224}
        className="!bg-[#001529]"
      >
        <div className="flex h-14 items-center gap-2 overflow-hidden px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1677FF] to-[#4096FF] font-bold text-white">
            图
          </div>
          {!collapsed && (
            <span className="whitespace-nowrap text-[15px] font-semibold text-white">图书管理系统</span>
          )}
        </div>
        <SideMenu collapsed={collapsed} />
      </Sider>
      <Layout>
        <HeaderBar />
        <Content className="overflow-auto bg-[#F0F2F5] p-4">
          <BreadcrumbNav />
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Spin size="large" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

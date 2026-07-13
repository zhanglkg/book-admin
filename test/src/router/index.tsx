import { Routes, Route, Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Login from '@/pages/Login';
import BasicLayout from '@/layouts/BasicLayout';
import { RequireAuth, RequirePermission } from './guard';
import { lazyPages } from './routes';

function Forbidden() {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面。"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RequireAuth>
            <BasicLayout />
          </RequireAuth>
        }
      >
        <Route index element={<lazyPages.Dashboard />} />
        <Route
          path="books"
          element={
            <RequirePermission permission="book:view">
              <lazyPages.Books />
            </RequirePermission>
          }
        />
        <Route
          path="categories"
          element={
            <RequirePermission permission="category:view">
              <lazyPages.Categories />
            </RequirePermission>
          }
        />
        <Route
          path="users"
          element={
            <RequirePermission permission="user:view">
              <lazyPages.Users />
            </RequirePermission>
          }
        />
        <Route
          path="borrows"
          element={
            <RequirePermission permission="borrow:view">
              <lazyPages.Borrows />
            </RequirePermission>
          }
        />
        <Route
          path="settings/role"
          element={
            <RequirePermission permission="system:role">
              <lazyPages.RolePermission />
            </RequirePermission>
          }
        />
        <Route
          path="settings/system"
          element={
            <RequirePermission permission="system:view">
              <lazyPages.System />
            </RequirePermission>
          }
        />
      </Route>

      <Route path="/403" element={<Forbidden />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

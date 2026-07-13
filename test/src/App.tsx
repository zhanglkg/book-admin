import { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';
import AppRouter from '@/router';
import { useAuthStore } from '@/stores/useAuthStore';

export default function App() {
  const token = useAuthStore((s) => s.token);
  const userInfo = useAuthStore((s) => s.userInfo);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const logout = useAuthStore((s) => s.logout);

  // 刷新后 token 还在但内存中的用户信息已丢失，需先回拉权限再渲染路由
  const [booting, setBooting] = useState<boolean>(() => !!token && !userInfo);
  const started = useRef(false);

  useEffect(() => {
    if (!booting || started.current) return;
    started.current = true;
    fetchProfile()
      .then(() => setBooting(false))
      .catch(() => {
        logout();
        setBooting(false);
      });
  }, [booting, fetchProfile, logout]);

  if (booting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

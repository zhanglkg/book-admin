import { Layout, Button, Dropdown, Avatar, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

const { Header } = Layout;

export default function HeaderBar() {
  const collapsed = useAppStore((state) => state.collapsed);
  const toggleCollapsed = useAppStore((state) => state.toggleCollapsed);
  const userInfo = useAuthStore((state) => state.userInfo);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const onMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const items = [
    { key: 'username', label: `角色：${userInfo?.roleName ?? '-'}`, disabled: true },
    { type: 'divider' as const },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
  ];

  return (
    <Header className="!flex !h-14 !items-center !justify-between !border-b !border-[#f0f0f0] !bg-white !px-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <Button
        type="text"
        aria-label="切换菜单"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className="!text-[16px] !text-[#595959]"
      />
      <Dropdown menu={{ items, onClick: onMenuClick }} placement="bottomRight" trigger={['click']}>
        <Space className="cursor-pointer">
          <Avatar
            src={userInfo?.avatar || undefined}
            style={{ backgroundColor: '#1677FF' }}
            icon={!userInfo?.avatar && <UserOutlined />}
          >
            {!userInfo?.avatar && (userInfo?.nickname?.[0] ?? 'U')}
          </Avatar>
          <span className="text-[14px] text-[#1F1F1F]">{userInfo?.nickname}</span>
        </Space>
      </Dropdown>
    </Header>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { BookOpen, ShieldCheck, BarChart3, Users } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginParams } from '@/types/user';

const { Title, Text } = Typography;

const features = [
  { icon: BookOpen, label: '图书全生命周期管理' },
  { icon: BarChart3, label: '数据看板与借阅分析' },
  { icon: Users, label: '会员与借阅流程管控' },
  { icon: ShieldCheck, label: '角色权限精细授权' },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginParams>();

  const onFinish = (values: LoginParams & { remember?: boolean }) => {
    setLoading(true);
    login({ username: values.username, password: values.password })
      .then(() => {
        message.success('登录成功，欢迎回来');
        navigate('/', { replace: true });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fillDemo = (username: string) => {
    form.setFieldsValue({ username, password: '123456' });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* 品牌展示区 */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0958D9] via-[#1677FF] to-[#4096FF] p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold tracking-wide">图书后台管理系统</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-snug">
            让图书馆运营
            <br />
            更高效、更智能
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/80">
            集图书、分类、会员、借阅与系统权限于一体的企业级管理平台，助力数字化运营。
          </p>
          <div className="grid grid-cols-1 gap-4 pt-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <f.icon className="h-5 w-5" />
                </div>
                <span className="text-sm text-white/90">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-sm text-white/60">© 2026 Book Admin · Enterprise Platform</div>
      </div>

      {/* 登录表单区 */}
      <div className="flex flex-1 items-center justify-center bg-[#F0F2F5] px-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-10">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1677FF] text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-[#1F1F1F]">图书后台管理系统</span>
          </div>

          <Title level={3} className="!mb-1 !text-[#1F1F1F]">
            账号登录
          </Title>
          <Text type="secondary" className="block !mb-8">
            请输入管理员账号以进入控制台
          </Text>

          <Form form={form} layout="vertical" size="large" onFinish={onFinish} initialValues={{ remember: true }}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="请输入密码" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" className="!mb-4">
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="!h-11 !text-base">
              登 录
            </Button>
          </Form>

          <div className="mt-6 rounded-lg bg-[#F0F2F5] p-3 text-xs text-[#595959]">
            <span className="font-medium text-[#1677FF]">演示账号：</span>
            <button type="button" className="cursor-pointer underline-offset-2 hover:underline" onClick={() => fillDemo('admin')}>
              admin / 123456
            </button>
            <span className="mx-2 text-gray-300">|</span>
            <button type="button" className="cursor-pointer underline-offset-2 hover:underline" onClick={() => fillDemo('librarian')}>
              librarian / 123456
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

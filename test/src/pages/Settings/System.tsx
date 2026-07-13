import { useState } from 'react';
import { App as AntdApp, Button, Card, Divider, Form, Input, InputNumber, Switch, Typography } from 'antd';
import PageContainer from '@/components/PageContainer';

interface SystemForm {
  siteName: string;
  borrowDays: number;
  overdueRate: number;
  pageSize: number;
  allowRegister: boolean;
  icp: string;
}

const DEFAULT: SystemForm = {
  siteName: '智阅图书管理系统',
  borrowDays: 30,
  overdueRate: 0.5,
  pageSize: 10,
  allowRegister: false,
  icp: '京ICP备2025000000号',
};

export default function System() {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<SystemForm>();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setSaving(true);
        // 模拟提交：真实环境调用 system 配置接口
        setTimeout(() => {
          message.success('系统参数已保存');
          setSaving(false);
          console.info('system params', values);
        }, 400);
      })
      .catch((err) => console.error(err));
  };

  return (
    <PageContainer title="系统参数" description="基础系统参数与借阅规则设置">
      <Card className="max-w-2xl">
        <Form<SystemForm> form={form} layout="vertical" initialValues={DEFAULT} className="mt-2">
          <Typography.Title level={5} className="!mb-2 !mt-0">
            基础信息
          </Typography.Title>
          <Form.Item name="siteName" label="系统名称" rules={[{ required: true, message: '请输入系统名称' }]}>
            <Input placeholder="如：智阅图书管理系统" />
          </Form.Item>
          <Form.Item name="icp" label="备案号">
            <Input placeholder="如：京ICP备xxxxxxxx号" />
          </Form.Item>

          <Divider />

          <Typography.Title level={5} className="!mb-2">
            借阅规则
          </Typography.Title>
          <div className="flex gap-4">
            <Form.Item name="borrowDays" label="默认借阅期限(天)" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={1} max={365} className="!w-full" />
            </Form.Item>
            <Form.Item name="overdueRate" label="逾期每日费率(%)" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={0} max={100} precision={2} className="!w-full" />
            </Form.Item>
            <Form.Item name="pageSize" label="默认每页条数" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={5} max={100} className="!w-full" />
            </Form.Item>
          </div>

          <Divider />

          <Form.Item name="allowRegister" label="允许读者自助注册" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div className="mt-4 flex justify-end">
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存参数
            </Button>
          </div>
        </Form>
      </Card>
    </PageContainer>
  );
}

import { useEffect, useState } from 'react';
import {
  App as AntdApp,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import PageContainer from '@/components/PageContainer';
import { useTable } from '@/hooks/useTable';
import { createMember, deleteMember, getMembers, updateMember } from '@/api/user';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Member, UserStatus } from '@/types/user';

const GENDER_LABEL: Record<Member['gender'], string> = { male: '男', female: '女', unknown: '未知' };

export default function Users() {
  const { message } = AntdApp.useApp();
  const permissions = useAuthStore((s) => s.permissions);
  const canEdit = permissions.includes('user:edit');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchForm] = Form.useForm<{ keyword?: string; status?: UserStatus }>();
  const [form] = Form.useForm<Partial<Member>>();

  const table = useTable<Member, { keyword?: string; status?: UserStatus; page?: number; pageSize?: number }>({
    fetch: getMembers,
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active', gender: 'unknown' });
    setModalOpen(true);
  };
  const openEdit = (record: Member) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitting(true);
        const task = editing ? updateMember(editing.id, values) : createMember(values);
        task
          .then(() => {
            message.success(editing ? '更新成功' : '新增成功');
            setModalOpen(false);
            table.reload();
          })
          .catch((err) => console.error(err))
          .finally(() => setSubmitting(false));
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id: number) => {
    deleteMember(id)
      .then(() => {
        message.success('删除成功');
        table.reload();
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (values: { keyword?: string; status?: UserStatus }) => {
    table.search({ keyword: values.keyword?.trim() || undefined, status: values.status });
  };
  const onReset = () => {
    searchForm.resetFields();
    table.reset();
  };

  const columns: ColumnsType<Member> = [
    {
      title: '会员',
      render: (_, r) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1677ff' }}>{r.nickname}</Avatar>
          <div>
            <div className="font-medium leading-tight">{r.nickname}</div>
            <div className="text-xs text-gray-400">@{r.username}</div>
          </div>
        </Space>
      ),
    },
    { title: '手机', dataIndex: 'phone', width: 140 },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      render: (g: Member['gender']) => GENDER_LABEL[g],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: UserStatus) => (s === 'active' ? <Tag color="success">正常</Tag> : <Tag color="default">禁用</Tag>),
    },
    { title: '借阅数', dataIndex: 'borrowCount', width: 90, render: (v: number) => <Tag color="blue">{v}</Tag> },
    { title: '注册时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {canEdit && <a onClick={() => openEdit(record)}>编辑</a>}
          {canEdit && (
            <Popconfirm title="确认删除该会员？" onConfirm={() => handleDelete(record.id)} okText="删除" cancelText="取消">
              <a className="!text-[#FF4D4F]">删除</a>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="用户管理"
      description="会员信息、状态与借阅统计"
      extra={
        canEdit && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增会员
          </Button>
        )
      }
    >
      <Form form={searchForm} layout="inline" onFinish={onSearch} className="mb-4 gap-y-3">
        <Form.Item name="keyword" label="关键词">
          <Input allowClear placeholder="昵称 / 账号 / 手机" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            placeholder="全部"
            options={[
              { label: '正常', value: 'active' },
              { label: '禁用', value: 'disabled' },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table<Member>
        rowKey="id"
        columns={columns}
        dataSource={table.data}
        loading={table.loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: table.page,
          pageSize: table.pageSize,
          total: table.total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => table.changePage(p, ps),
        }}
      />

      <Modal
        title={editing ? '编辑会员' : '新增会员'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="flex gap-4">
            <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]} className="flex-1">
              <Input placeholder="如：张伟" />
            </Form.Item>
            <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]} className="flex-1">
              <Input placeholder="如：reader1001" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="phone" label="手机" className="flex-1">
              <Input placeholder="11 位手机号" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" className="flex-1">
              <Input placeholder="name@mail.com" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="gender" label="性别" className="flex-1">
              <Select
                options={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' },
                  { label: '未知', value: 'unknown' },
                ]}
              />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]} className="flex-1">
              <Radio.Group>
                <Radio value="active">正常</Radio>
                <Radio value="disabled">禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
}

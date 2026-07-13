import { useEffect, useMemo, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import PageContainer from '@/components/PageContainer';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/api/category';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Category, CategoryForm } from '@/types/category';

export default function Categories() {
  const { message } = AntdApp.useApp();
  const permissions = useAuthStore((s) => s.permissions);
  const canEdit = permissions.includes('category:edit');

  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CategoryForm>();

  const load = () => {
    setLoading(true);
    getCategories()
      .then(setList)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const parentOptions = useMemo(() => {
    const opts = list
      .filter((c) => c.parentId === null && c.id !== editing?.id)
      .map((c) => ({ label: c.name, value: c.id }));
    return [{ label: '顶级分类', value: 0 }, ...opts];
  }, [list, editing]);

  const parentName = (id: number | null) => list.find((c) => c.id === id)?.name || '—';

  const filtered = useMemo(() => {
    const kw = keyword.trim();
    const sorted = [...list].sort((a, b) => (a.parentId ?? 0) - (b.parentId ?? 0) || a.sort - b.sort);
    return kw ? sorted.filter((c) => c.name.includes(kw) || c.description.includes(kw)) : sorted;
  }, [list, keyword]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ parentId: 0, sort: 1, description: '' });
    setModalOpen(true);
  };
  const openEdit = (record: Category) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitting(true);
        const payload: CategoryForm = { ...values, parentId: values.parentId || null };
        const task = editing ? updateCategory(editing.id, payload) : createCategory(payload);
        task
          .then(() => {
            message.success(editing ? '更新成功' : '新增成功');
            setModalOpen(false);
            load();
          })
          .catch((err) => console.error(err))
          .finally(() => setSubmitting(false));
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id: number) => {
    deleteCategory(id)
      .then(() => {
        message.success('删除成功');
        load();
      })
      .catch((err) => console.error(err));
  };

  const columns: ColumnsType<Category> = [
    {
      title: '分类名称',
      dataIndex: 'name',
      render: (name: string, r) => (
        <span className="font-medium">
          {r.parentId ? <span className="text-gray-300">└ </span> : null}
          {name}
        </span>
      ),
    },
    { title: '上级分类', width: 140, render: (_, r) => parentName(r.parentId) },
    { title: '排序', dataIndex: 'sort', width: 80 },
    { title: '图书数', dataIndex: 'bookCount', width: 90, render: (v: number) => <Tag color="blue">{v}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {canEdit && <a onClick={() => openEdit(record)}>编辑</a>}
          {canEdit && (
            <Popconfirm
              title="确认删除该分类？"
              description="存在子分类时无法删除"
              onConfirm={() => handleDelete(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <a className="!text-[#FF4D4F]">删除</a>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="分类管理"
      description="维护图书分类层级与排序"
      extra={
        canEdit && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增分类
          </Button>
        )
      }
    >
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索分类名称 / 描述"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <Table<Category>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{ showTotal: (t) => `共 ${t} 条` }}
      />

      <Modal
        title={editing ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="如：文学小说" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="parentId" label="上级分类" className="flex-1">
              <Select options={parentOptions} />
            </Form.Item>
            <Form.Item name="sort" label="排序" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="分类用途说明" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}

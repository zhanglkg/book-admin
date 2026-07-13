import { useEffect, useMemo, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Form,
  Input,
  InputNumber,
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
import PageContainer from '@/components/PageContainer';
import BookCover from '@/components/BookCover';
import { useTable } from '@/hooks/useTable';
import { createBook, deleteBook, getBooks, updateBook } from '@/api/book';
import { getCategories } from '@/api/category';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Book, BookForm, BookQuery, BookStatus } from '@/types/book';
import type { Category } from '@/types/category';

export default function Books() {
  const { message } = AntdApp.useApp();
  const permissions = useAuthStore((s) => s.permissions);
  const canAdd = permissions.includes('book:add');
  const canEdit = permissions.includes('book:edit');
  const canDelete = permissions.includes('book:delete');

  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchForm] = Form.useForm<BookQuery>();
  const [form] = Form.useForm<BookForm>();

  const table = useTable<Book, BookQuery>({ fetch: getBooks });

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => console.error(err));
  }, []);

  const catOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'on', stock: 1, price: 0, categoryId: categories[0]?.id });
    setModalOpen(true);
  };

  const openEdit = (record: Book) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitting(true);
        const task = editing ? updateBook(editing.id, values) : createBook(values);
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
    deleteBook(id)
      .then(() => {
        message.success('删除成功');
        table.reload();
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (values: BookQuery) => {
    const cleaned: BookQuery = { keyword: values.keyword?.trim() || undefined, categoryId: values.categoryId, status: values.status };
    table.search(cleaned);
  };

  const onReset = () => {
    searchForm.resetFields();
    table.reset();
  };

  const columns: ColumnsType<Book> = [
    { title: '封面', dataIndex: 'cover', width: 64, render: (cover: string, r: Book) => <BookCover title={r.title} isbn={r.isbn} cover={cover} width={40} height={56} /> },
    { title: '书名', dataIndex: 'title', ellipsis: true },
    { title: '作者', dataIndex: 'author', width: 120 },
    { title: '分类', dataIndex: 'categoryName', width: 110 },
    { title: 'ISBN', dataIndex: 'isbn', width: 150 },
    { title: '价格', dataIndex: 'price', width: 90, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '库存', dataIndex: 'stock', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: BookStatus) => (s === 'on' ? <Tag color="success">上架</Tag> : <Tag>下架</Tag>),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 160 },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {canEdit && <a onClick={() => openEdit(record)}>编辑</a>}
          {canDelete && (
            <Popconfirm title="确认删除该图书？" onConfirm={() => handleDelete(record.id)} okText="删除" cancelText="取消">
              <a className="!text-[#FF4D4F]">删除</a>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="图书管理"
      description="图书的增删改查与上下架"
      extra={
        canAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增图书
          </Button>
        )
      }
    >
      <Form form={searchForm} layout="inline" onFinish={onSearch} className="mb-4 gap-y-3">
        <Form.Item name="keyword" label="关键词">
          <Input allowClear placeholder="书名 / 作者 / ISBN" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item name="categoryId" label="分类">
          <Select allowClear placeholder="全部分类" options={catOptions} style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            placeholder="全部"
            options={[
              { label: '上架', value: 'on' },
              { label: '下架', value: 'off' },
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

      <Table<Book>
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
        title={editing ? '编辑图书' : '新增图书'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={640}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="书名" rules={[{ required: true, message: '请输入书名' }]}>
            <Input placeholder="请输入书名" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]} className="flex-1">
              <Input placeholder="请输入作者" />
            </Form.Item>
            <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: '请输入 ISBN' }]} className="flex-1">
              <Input placeholder="请输入 ISBN" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="categoryId" label="分类" rules={[{ required: true, message: '请选择分类' }]} className="flex-1">
              <Select placeholder="请选择分类" options={catOptions} />
            </Form.Item>
            <Form.Item name="publisher" label="出版社" className="flex-1">
              <Input placeholder="请输入出版社" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="price" label="价格(元)" rules={[{ required: true, message: '请输入价格' }]} className="flex-1">
              <InputNumber min={0} precision={2} className="!w-full" />
            </Form.Item>
            <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存' }]} className="flex-1">
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]} className="flex-1">
              <Radio.Group>
                <Radio value="on">上架</Radio>
                <Radio value="off">下架</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item name="cover" label="封面地址">
            <Input placeholder="https://... 留空将自动生成真实封面图" />
          </Form.Item>
          <Form.Item name="description" label="简介">
            <Input.TextArea rows={3} placeholder="请输入图书简介" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, DatePicker, Form, Image, Input, Modal, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import PageContainer from '@/components/PageContainer';
import { useTable } from '@/hooks/useTable';
import { getBorrows, borrowBook, returnBook } from '@/api/borrow';
import { getBooks } from '@/api/book';
import { getMembers } from '@/api/user';
import { useAuthStore } from '@/stores/useAuthStore';
import type { BorrowRecord, BorrowQuery, BorrowStatus, BorrowForm } from '@/types/borrow';
import type { Book } from '@/types/book';
import type { Member } from '@/types/user';

const STATUS_META: Record<BorrowStatus, { label: string; color: string }> = {
  borrowing: { label: '借阅中', color: 'processing' },
  returned: { label: '已归还', color: 'success' },
  overdue: { label: '已逾期', color: 'error' },
};

interface RegisterValues {
  bookId: number;
  userId: number;
  dueDate: Dayjs;
}

export default function Borrows() {
  const { message } = AntdApp.useApp();
  const permissions = useAuthStore((s) => s.permissions);
  const canManage = permissions.includes('borrow:manage');

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchForm] = Form.useForm<BorrowQuery>();
  const [form] = Form.useForm<RegisterValues>();

  const table = useTable<BorrowRecord, BorrowQuery>({ fetch: getBorrows });

  useEffect(() => {
    if (!canManage) return;
    getBooks({ page: 1, pageSize: 100 })
      .then((res) => setBooks(res.list.filter((b) => b.status === 'on' && b.stock > 0)))
      .catch((err) => console.error(err));
    getMembers({ page: 1, pageSize: 100 })
      .then((res) => setMembers(res.list.filter((m) => m.status === 'active')))
      .catch((err) => console.error(err));
  }, [canManage]);

  const bookOptions = useMemo(() => books.map((b) => ({ label: `${b.title}（库存${b.stock}）`, value: b.id })), [books]);
  const memberOptions = useMemo(() => members.map((m) => ({ label: m.nickname, value: m.id })), [members]);

  const openRegister = () => {
    form.resetFields();
    form.setFieldsValue({ dueDate: dayjs().add(30, 'day') });
    setModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitting(true);
        const book = books.find((b) => b.id === values.bookId);
        const member = members.find((m) => m.id === values.userId);
        const payload: BorrowForm = {
          bookId: values.bookId,
          userId: values.userId,
          dueDate: values.dueDate.format('YYYY-MM-DD'),
          bookTitle: book?.title,
          userName: member?.nickname,
        };
        borrowBook(payload)
          .then(() => {
            message.success('借书登记成功');
            setModalOpen(false);
            table.reload();
          })
          .catch((err) => console.error(err))
          .finally(() => setSubmitting(false));
      })
      .catch((err) => console.error(err));
  };

  const handleReturn = (record: BorrowRecord) => {
    returnBook(record.id)
      .then(() => {
        message.success('还书成功');
        table.reload();
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (values: BorrowQuery) => {
    table.search({ keyword: values.keyword?.trim() || undefined, status: values.status });
  };
  const onReset = () => {
    searchForm.resetFields();
    table.reset();
  };

  const columns: ColumnsType<BorrowRecord> = [
    { title: '封面', dataIndex: 'bookCover', width: 64, render: (c: string) => <Image src={c} width={36} height={48} className="rounded object-cover" /> },
    { title: '书名', dataIndex: 'bookTitle', ellipsis: true },
    { title: '借阅人', dataIndex: 'userName', width: 120 },
    { title: '借出日期', dataIndex: 'borrowDate', width: 120 },
    { title: '应还日期', dataIndex: 'dueDate', width: 120 },
    { title: '归还日期', dataIndex: 'returnDate', width: 120, render: (v: string | null) => v ?? <span className="text-gray-300">—</span> },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: BorrowStatus) => <Tag color={STATUS_META[s].color}>{STATUS_META[s].label}</Tag>,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) =>
        canManage && record.status !== 'returned' ? (
          <a onClick={() => handleReturn(record)}>还书</a>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
  ];

  return (
    <PageContainer
      title="借阅管理"
      description="借书登记、还书流程与借阅记录查询"
      extra={
        canManage && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openRegister}>
            借书登记
          </Button>
        )
      }
    >
      <Form form={searchForm} layout="inline" onFinish={onSearch} className="mb-4 gap-y-3">
        <Form.Item name="keyword" label="关键词">
          <Input allowClear placeholder="书名 / 借阅人" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            placeholder="全部"
            options={[
              { label: '借阅中', value: 'borrowing' },
              { label: '已归还', value: 'returned' },
              { label: '已逾期', value: 'overdue' },
            ]}
            style={{ width: 130 }}
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

      <Table<BorrowRecord>
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
        title="借书登记"
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="bookId" label="选择图书" rules={[{ required: true, message: '请选择图书' }]}>
            <Select showSearch optionFilterProp="label" placeholder="请选择可借图书" options={bookOptions} />
          </Form.Item>
          <Form.Item name="userId" label="借阅会员" rules={[{ required: true, message: '请选择会员' }]}>
            <Select showSearch optionFilterProp="label" placeholder="请选择会员" options={memberOptions} />
          </Form.Item>
          <Form.Item name="dueDate" label="应还日期" rules={[{ required: true, message: '请选择应还日期' }]}>
            <DatePicker className="!w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}

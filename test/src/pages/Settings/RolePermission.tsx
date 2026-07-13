import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Empty, Space, Spin, Tree, Tag } from 'antd';
import type { DataNode } from 'antd/es/tree';
import PageContainer from '@/components/PageContainer';
import { getRoles, updateRolePermissions } from '@/api/user';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Role } from '@/types/user';

const PERMISSION_TREE: DataNode[] = [
  { title: '数据看板', key: 'dashboard:view' },
  {
    title: '图书管理',
    key: 'book',
    children: [
      { title: '查看', key: 'book:view' },
      { title: '新增', key: 'book:add' },
      { title: '编辑', key: 'book:edit' },
      { title: '删除', key: 'book:delete' },
    ],
  },
  {
    title: '分类管理',
    key: 'category',
    children: [
      { title: '查看', key: 'category:view' },
      { title: '编辑', key: 'category:edit' },
    ],
  },
  {
    title: '用户管理',
    key: 'user',
    children: [
      { title: '查看', key: 'user:view' },
      { title: '编辑', key: 'user:edit' },
    ],
  },
  {
    title: '借阅管理',
    key: 'borrow',
    children: [
      { title: '查看', key: 'borrow:view' },
      { title: '借还管理', key: 'borrow:manage' },
    ],
  },
  {
    title: '系统设置',
    key: 'system',
    children: [
      { title: '查看', key: 'system:view' },
      { title: '角色权限', key: 'system:role' },
    ],
  },
];

const LEAF_KEYS = PERMISSION_TREE.flatMap((n) => (n.children ? n.children.map((c) => c.key as string) : [n.key as string]));

export default function RolePermission() {
  const { message } = AntdApp.useApp();
  const permissions = useAuthStore((s) => s.permissions);
  const canRole = permissions.includes('system:role');

  const [roles, setRoles] = useState<Role[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getRoles()
      .then((data) => {
        setRoles(data);
        if (data.length && activeId === null) {
          setActiveId(data[0].id);
          setChecked(data[0].permissions.filter((p) => LEAF_KEYS.includes(p)));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const activeRole = useMemo(() => roles.find((r) => r.id === activeId) || null, [roles, activeId]);

  const selectRole = (role: Role) => {
    setActiveId(role.id);
    setChecked(role.permissions.filter((p) => LEAF_KEYS.includes(p)));
  };

  const handleSave = () => {
    if (!activeRole) return;
    // 仅保存叶子权限码，剔除父节点（book/system 等非权限码）
    const leafChecked = checked.filter((p) => LEAF_KEYS.includes(p));
    setSaving(true);
    updateRolePermissions(activeRole.id, leafChecked)
      .then((role) => {
        message.success('权限已保存');
        setRoles((prev) => prev.map((r) => (r.id === role.id ? role : r)));
      })
      .catch((err) => console.error(err))
      .finally(() => setSaving(false));
  };

  return (
    <PageContainer title="角色权限" description="配置角色可访问的菜单与操作权限">
      {!canRole ? (
        <Empty description="当前账号无角色权限配置权限" />
      ) : (
        <Spin spinning={loading}>
          <div className="flex flex-col gap-4 lg:flex-row">
            <Card size="small" title="角色列表" className="lg:w-72">
              <Space direction="vertical" className="w-full">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => selectRole(role)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                      role.id === activeId ? 'border-[#1677FF] bg-[#1677FF]/5' : 'border-gray-200 hover:border-[#4096FF]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-gray-400">{role.description}</div>
                    </div>
                    <Tag color="blue">{role.permissions.length}</Tag>
                  </button>
                ))}
              </Space>
            </Card>

            <Card
              size="small"
              title={activeRole ? `权限分配 · ${activeRole.name}` : '权限分配'}
              className="flex-1"
              extra={
                <Button type="primary" onClick={handleSave} loading={saving} disabled={!activeRole}>
                  保存权限
                </Button>
              }
            >
              <Tree
                checkable
                defaultExpandAll
                treeData={PERMISSION_TREE}
                checkedKeys={checked}
                onCheck={(keys) => setChecked(keys as string[])}
              />
            </Card>
          </div>
        </Spin>
      )}
    </PageContainer>
  );
}

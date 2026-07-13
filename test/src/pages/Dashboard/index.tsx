import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { BookOutlined, SwapOutlined, TeamOutlined, TagsOutlined } from '@ant-design/icons';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageContainer from '@/components/PageContainer';
import { getBorrowTrend, getCategoryDistribution, getDashboardStats } from '@/api/dashboard';
import type { CategoryDistribution, DashboardStats, TrendPoint } from '@/types/dashboard';

const PIE_COLORS = ['#1677FF', '#52C41A', '#FAAD14', '#FF4D4F', '#722ED1', '#13C2C2'];

function StatCard({
  icon,
  title,
  value,
  color,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  hint?: string;
}) {
  return (
    <Card bordered={false} className="!shadow-sm transition-shadow hover:!shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] text-[#8c8c8c]">{title}</div>
          <div className="text-[26px] font-semibold leading-tight text-[#1F1F1F]">{value}</div>
          {hint && <div className="text-[12px] text-[#bfbfbf]">{hint}</div>}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [dist, setDist] = useState<CategoryDistribution[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getBorrowTrend(), getCategoryDistribution()])
      .then(([s, t, d]) => {
        setStats(s);
        setTrend(t);
        setDist(d);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <PageContainer title="数据看板" description="运营数据总览与分析">
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  const cards = [
    { title: '图书总量', value: stats.totalBooks, color: '#1677FF', icon: <BookOutlined />, hint: '在册书目' },
    { title: '借阅总量', value: stats.totalBorrows, color: '#52C41A', icon: <SwapOutlined />, hint: `在借 ${stats.borrowingCount} 本` },
    { title: '会员总数', value: stats.totalUsers, color: '#FAAD14', icon: <TeamOutlined />, hint: '注册读者' },
    { title: '分类数量', value: stats.totalCategories, color: '#722ED1', icon: <TagsOutlined />, hint: `逾期 ${stats.overdueCount} 笔` },
  ];

  return (
    <PageContainer title="数据看板" description="运营数据总览与分析">
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col key={c.title} xs={24} sm={12} xl={6}>
            <StatCard {...c} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} xl={16}>
          <Card title="近 7 日借阅趋势" bordered={false} className="!shadow-sm">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cBorrow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677FF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1677FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cReturn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52C41A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#52C41A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="borrow" name="借出" stroke="#1677FF" fill="url(#cBorrow)" strokeWidth={2} />
                  <Area type="monotone" dataKey="return" name="归还" stroke="#52C41A" fill="url(#cReturn)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="分类图书分布" bordered={false} className="!shadow-sm">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="72%"
                    label={({ name }) => name}
                  >
                    {dist.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

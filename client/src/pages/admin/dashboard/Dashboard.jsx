import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  Spin,
  Alert,
  Typography,
  Space,
  Tag,
  Progress,
  Avatar,
  Segmented,
  Tabs,
  Badge,
  Tooltip,
  Empty,
} from 'antd';
import {
  UserOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TrophyOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import dayjs from 'dayjs';

import axiosInstance from '@/services/apis';
import { formatCurrency } from '@/helpers';
import Branchs from '@/services/branches';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Bảng màu gradient hiện đại
const CHART_COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f5576c',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#fee140',
];

// Màu cho các chi nhánh
const BRANCH_COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa541c',
  '#2f54eb',
  '#a0d911',
  '#fadb14',
  '#f759ab',
];

const Dashboard = () => {
  const [allStats, setAllStats] = useState({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
  });
  const [allComparison, setAllComparison] = useState({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
  });
  const [allHistorical, setAllHistorical] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  });

  // State cho chi nhánh - FIX: Tách riêng branch data
  const [allBranchData, setAllBranchData] = useState({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
  });

  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [branch, setBranch] = useState(null);
  const currentStats = allStats[selectedPeriod];
  const comparisonData = allComparison[selectedPeriod];
  const historicalData = allHistorical[selectedPeriod];
  const currentBranchData = allBranchData[selectedPeriod];

  const fetchStats = async (period) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/dashboard/stats/${period}/current`,
        { timeout: 3000 },
      );

      return response.data?.data || {};
    } catch (error) {
      console.error(`Error fetching ${period} stats:`, error);
      return null;
    }
  };

  const fetchStatsWithComparison = async (period, date) => {
    try {
      const dateParam = date ? `?date=${date.toISOString()}` : '';
      const response = await axiosInstance.get(
        `/api/v1/dashboard/stats/${period}${dateParam}`,
        { timeout: 10000 },
      );
      return response.data?.data || {};
    } catch (error) {
      console.error(`Error fetching ${period} comparison data:`, error);
      return null;
    }
  };

  const fetchHistoricalData = async (period) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/dashboard/stats/${period}/historical?limit=30`,
        { timeout: 15000 },
      );
      return response.data?.data || [];
    } catch (error) {
      console.error(`Error fetching ${period} historical data:`, error);
      return [];
    }
  };
  const fetchBranch = async () => {
    try {
      const response = await Branchs.getAll();
      setBranch(response.data.data);
    } catch (error) {
      console.error(`Error fetching branches:`, error);
      return [];
    }
  };
  useEffect(() => {
    fetchBranch();
    const loadAllDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const periods = ['daily', 'weekly', 'monthly', 'yearly'];

        const statsPromises = periods.map((period) => fetchStats(period));
        const comparisonPromises = periods.map((period) =>
          fetchStatsWithComparison(period, dateRange?.[0]),
        );
        const historicalPromises = periods.map((period) =>
          fetchHistoricalData(period),
        );

        const [statsResults, comparisonResults, historicalResults] =
          await Promise.all([
            Promise.all(statsPromises),
            Promise.all(comparisonPromises),
            Promise.all(historicalPromises),
          ]);

        const newAllStats = {};
        const newAllComparison = {};
        const newAllHistorical = {};
        const newAllBranchData = {};

        periods.forEach((period, index) => {
          const statsData = historicalResults[index];

          if (statsData) {
            const { branchOverview, ...mainStats } = statsData;

            newAllStats[period] = mainStats;
            newAllBranchData[period] = mainStats;
          } else {
            newAllStats[period] = null;
            newAllBranchData[period] = null;
          }

          newAllComparison[period] = comparisonResults[index];
          newAllHistorical[period] = historicalResults[index];
        });

        setAllStats(newAllStats);
        setAllComparison(newAllComparison);
        setAllHistorical(newAllHistorical);
        setAllBranchData(newAllBranchData);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadAllDashboardData();
  }, [dateRange]);

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const ChangeIndicator = ({ change, showIcon = true }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    const color = isPositive ? '#52c41a' : isNegative ? '#f5222d' : '#8c8c8c';
    const Icon = isPositive
      ? ArrowUpOutlined
      : isNegative
        ? ArrowDownOutlined
        : MinusOutlined;

    return (
      <Space size={4} style={{ marginTop: 8 }}>
        {showIcon && <Icon style={{ color, fontSize: '12px' }} />}
        <Text style={{ color, fontSize: '13px', fontWeight: 500 }}>
          {Math.abs(change).toFixed(1)}%
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          vs kỳ trước
        </Text>
      </Space>
    );
  };

  const BranchOverview = () => {
    const [selectedBranch, setSelectedBranch] = useState(branch?.[0]?._id);
    const [selectedDate, setSelectedDate] = useState(null);

    const branchStats = currentBranchData || [];
    const branchComparison = currentBranchData?.branchComparison || [];

    const comparisonMap = useMemo(() => {
      const map = {};
      branchComparison.forEach((comp) => {
        const branchId = comp.branchId?.$oid || comp.branchId;
        map[branchId] = comp;
      });
      return map;
    }, [branchComparison]);

    const filteredBranchStats = useMemo(() => {
      // Chuyển branchStats sang array để xử lý dễ hơn
      let data = Object.values(branchStats);

      data = data.filter((b) =>
        b?.branchOverview?.branchStats?.some(
          (bs) => bs.branchId === selectedBranch,
        ),
      );

      return data;
    }, [branchStats, selectedBranch, selectedDate]);
    const branchChartData = useMemo(() => {
      return filteredBranchStats?.flatMap((branch, index) => {
        const formattedDate = dayjs(branch.date).format(
          selectedPeriod === 'daily' || selectedPeriod === 'weekly'
            ? 'DD/MM'
            : selectedPeriod === 'monthly'
              ? 'MM/YYYY'
              : 'YYYY',
        );

        // Nếu chọn tất cả chi nhánh → map từng branchStats ra chart data
        if (selectedBranch === 'all') {
          return branch.branchOverview?.branchStats.map((bs, bsIndex) => ({
            branchId: bs.branchId,
            branchName: bs.branchName,
            totalRevenueBranch: bs.totalRevenue,
            totalOrdersBranch: bs.totalOrders,
            date: formattedDate,
            color: BRANCH_COLORS[(index + bsIndex) % BRANCH_COLORS.length],
          }));
        }

        const branchData = branch.branchOverview?.branchStats.find(
          (bs) => bs.branchId === selectedBranch,
        );

        return {
          branchId: selectedBranch,
          branchName: branchData?.branchName,
          totalRevenueBranch: branchData?.totalRevenue,
          totalOrdersBranch: branchData?.totalOrders,
          date: formattedDate,
          color: BRANCH_COLORS[index % BRANCH_COLORS.length],
        };
      });
    }, [filteredBranchStats, selectedBranch, selectedPeriod]);

    const pieChartData = useMemo(() => {
      if (!filteredBranchStats) return [];

      const branchMap = {};

      filteredBranchStats.forEach((day) => {
        day.branchOverview?.branchStats.forEach((branch) => {
          const id = branch.branchId;
          if (!branchMap[id]) {
            branchMap[id] = {
              branchId: id,
              branchName: branch.branchName,
              totalRevenue: 0,
            };
          }
          branchMap[id].totalRevenue += branch.totalRevenue; // cộng dồn doanh thu
        });
      });

      return Object.values(branchMap);
    }, [filteredBranchStats]);
    if (!branchStats || branchStats.length === 0) {
      return <Empty description="Chưa có dữ liệu chi nhánh" />;
    }

    return (
      <div>
        <Row gutter={[10, 10]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space
                  size="middle"
                  className="w-full! flex! justify-between py-10!"
                >
                  <Typography.Text className="text-lg!" strong>
                    Doanh thu theo chi nhánh
                  </Typography.Text>
                  <Select
                    size="middle"
                    style={{ width: 300 }}
                    value={selectedBranch}
                    onChange={(value) => setSelectedBranch(value)}
                  >
                    {branch.map((branch, index) => (
                      <Option key={branch._id} value={branch._id}>
                        {branch.name}
                      </Option>
                    ))}
                  </Select>
                </Space>
              }
            >
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={branchChartData}
                  margin={{ top: 5, right: 20, bottom: 60, left: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    dataKey="totalRevenueBranch"
                    fill="#82ca9d"
                    stroke="#82ca9d"
                    name="Doanh thu"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <Space size="middle" className="w-full! py-17!">
                  Doanh thu theo chi nhánh
                </Space>
              }
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="totalRevenue"
                    nameKey="branchName"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BRANCH_COLORS[index % BRANCH_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        {/* <Card style={{ marginTop: '24px' }} title="Chi tiết chi nhánh">
          <Table
            dataSource={filteredBranchStats}
            columns={branchColumns}
            rowKey={(record) => record.branchId}
            pagination={{ pageSize: 10 }}
          />
        </Card> */}
      </div>
    );
  };

  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];

    return historicalData
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: dayjs(item.date).format(
          selectedPeriod === 'daily'
            ? 'DD/MM'
            : selectedPeriod === 'weekly'
              ? 'DD/MM'
              : selectedPeriod === 'monthly'
                ? 'MM/YYYY'
                : 'YYYY',
        ),
        revenue: Math.round(item.totalRevenue),
        orders: item.totalOrders,
        customers: item.totalCustomers || 0,
        aov: Math.round(item.averageOrderValue / 1000),
      }));
  }, [historicalData, selectedPeriod]);

  const paymentMethodData = useMemo(() => {
    if (!currentStats?.paymentMethods) return [];

    return currentStats.paymentMethods.map((method, index) => ({
      name: method.method,
      value: method.amount,
      count: method.count,
      percentage: method.percentage,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [currentStats]);
  const topProductsColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_, __, index) => (
        <Avatar
          size="small"
          style={{
            backgroundColor: index < 3 ? '#faad14' : '#f0f0f0',
            color: index < 3 ? '#fff' : '#8c8c8c',
            fontWeight: 'bold',
          }}
        >
          {index + 1}
        </Avatar>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
      align: 'right',
      width: 100,
      render: (value) => (
        <Tag color="blue" style={{ margin: 0 }}>
          {value?.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: 'Doanh thu',
      dataKey: 'revenue',
      key: 'revenue',
      align: 'right',
      width: 130,
      render: (value) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(value || 0)}
        </Text>
      ),
    },
  ];

  const topViewCountColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_, __, index) => (
        <Avatar
          size="small"
          style={{
            backgroundColor: '#1890ff',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {index + 1}
        </Avatar>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      align: 'right',
      width: 100,
      render: (value) => (
        <Tag color="purple" style={{ margin: 0 }}>
          {value?.toLocaleString()}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
        }}
      >
        <Spin size="large" />
        <Text type="secondary" style={{ marginTop: 16 }}>
          Đang tải dữ liệu...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <a onClick={() => window.location.reload()}>Thử lại</a>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Dashboard
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Tổng quan hiệu suất kinh doanh
            </Text>
          </Col>
          <Col>
            <Space size="middle" align="center">
              <Segmented
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={[
                  { label: 'Hôm nay', value: 'daily' },
                  { label: 'Tuần', value: 'weekly' },
                  { label: 'Tháng', value: 'monthly' },
                  { label: 'Năm', value: 'yearly' },
                ]}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  height: '32px',
                  fontSize: '14px',
                }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {!currentStats ? (
        <Alert
          message="Chưa có dữ liệu"
          description={`Dữ liệu cho ${selectedPeriod} chưa được tải`}
          type="warning"
          showIcon
        />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={currentStats?.totalRevenue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ color: '#262626', fontSize: '28px' }}
                />
                {comparisonData?.comparison && (
                  <ChangeIndicator
                    change={comparisonData.comparison.revenueChange}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng đơn hàng"
                  value={currentStats?.totalOrders || 0}
                  valueStyle={{ color: '#262626', fontSize: '28px' }}
                />
                {comparisonData?.comparison && (
                  <ChangeIndicator
                    change={comparisonData.comparison.ordersChange}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Giá trị đơn hàng TB"
                  value={currentStats?.averageOrderValue || 0}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ color: '#262626', fontSize: '28px' }}
                />
                {comparisonData?.comparison && (
                  <ChangeIndicator
                    change={comparisonData.comparison.aovChange}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Khách hàng mới"
                  value={currentStats?.newCustomers || 0}
                  valueStyle={{ color: '#262626', fontSize: '28px' }}
                />
                {comparisonData?.comparison && (
                  <ChangeIndicator
                    change={comparisonData.comparison.customersChange || 0}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[10, 10]} style={{ marginBottom: '10px' }}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <LineChartOutlined style={{ color: '#667eea' }} />
                    <Text strong>Doanh thu & đơn hàng</Text>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 10, bottom: 10, left: 60 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#667eea" stopOpacity={4} />
                        <stop
                          offset="95%"
                          stopColor="#667eea"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f0f2f5" />
                    <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                    <YAxis
                      yAxisId="left"
                      stroke="#8c8c8c"
                      fontSize={12}
                      width={80}
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#8c8c8c"
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      }}
                      formatter={(value, name) => {
                        if (name === 'Doanh thu (triệu ₫)') {
                          return [`${formatCurrency(value)} VNĐ`, 'Doanh thu'];
                        }
                        return [value.toLocaleString(), name];
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#667eea"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      name="Doanh thu (triệu ₫)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      fill="#4facfe"
                      name="Số đơn hàng"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined style={{ color: '#667eea' }} />
                    <Text strong>Phương thức thanh toán</Text>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) =>
                        `${percentage.toFixed(1)}%`
                      }
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) =>
                        `${formatCurrency(Number(value))} VNĐ`
                      }
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: '16px' }}>
                  {paymentMethodData.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: '8px 0',
                      }}
                    >
                      <Space>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                          }}
                        />
                        <Text>{item.name}</Text>
                      </Space>
                      <Text strong>{`${formatCurrency(item.value)} VNĐ`}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
          <BranchOverview />
          {/* Products Tables */}
          <Row gutter={[10, 10]} style={{ marginTop: '10px' }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>Top sản phẩm bán chạy</Text>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Table
                  dataSource={currentStats?.topSellingProducts || []}
                  columns={topProductsColumns}
                  pagination={false}
                  rowKey="productId"
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <EyeOutlined style={{ color: '#722ed1' }} />
                    <Text strong>Sản phẩm được quan tâm</Text>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Table
                  dataSource={currentStats?.mostViewedProducts || []}
                  columns={topViewCountColumns}
                  pagination={false}
                  rowKey="productId"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Footer */}
      {currentStats?.lastUpdated && (
        <Card
          style={{
            marginTop: '24px',
            textAlign: 'center',
            borderRadius: '16px',
            border: 'none',
          }}
          bodyStyle={{ padding: '16px' }}
        >
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Dữ liệu được cập nhật lần cuối:{' '}
            <Text strong>
              {dayjs(currentStats.lastUpdated).format('DD/MM/YYYY - HH:mm:ss')}
            </Text>
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

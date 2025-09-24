import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Space, 
  Progress,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  List,
  Avatar,
  Tag,
  Tooltip,
  Alert,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  BarChartOutlined,
  PieChartOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

// Import dummy data
import usersData from '../../data/users.json';
import levelsData from '../../data/levels.json';
import entriesData from '../../data/entries.json';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminDashboard = ({ user, DashboardHeader, colors, isRTL, getCurrentFont, t }) => {
  const [systemStats, setSystemStats] = useState({});
  const [userManagementData, setUserManagementData] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    // Calculate system statistics
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.status === 'active').length;
    const totalEntries = entriesData.daily_entries.length;
    const pendingReviews = entriesData.daily_entries.filter(e => e.status === 'pending').length;
    
    // Role distribution
    const roleStats = {
      saalik: usersData.filter(u => u.role === 'Saalik').length,
      murabi: usersData.filter(u => u.role === 'Murabi').length,
      masool: usersData.filter(u => u.role === 'Masool').length,
      sheikh: usersData.filter(u => u.role === 'Sheikh').length,
      admin: usersData.filter(u => u.role === 'Admin').length
    };

    // Calculate average completion rate
    const avgCompletion = entriesData.daily_entries.length > 0 
      ? entriesData.daily_entries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / entriesData.daily_entries.length 
      : 0;

    // System health metrics
    const systemHealth = {
      database: 'healthy',
      api: 'healthy',
      storage: 'warning',
      backup: 'healthy'
    };

    setSystemStats({
      totalUsers,
      activeUsers,
      totalEntries,
      pendingReviews,
      roleStats,
      avgCompletion: Math.round(avgCompletion),
      systemHealth
    });

    // Prepare user management data
    const userTableData = usersData.map(user => {
      const userEntries = entriesData.daily_entries.filter(e => e.user_id === user.id);
      const avgCompletion = userEntries.length > 0 
        ? userEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / userEntries.length 
        : 0;
      
      const level = levelsData.levels.find(l => l.level === user.level);
      
      return {
        ...user,
        key: user.id,
        entriesCount: userEntries.length,
        avgCompletion: Math.round(avgCompletion),
        levelName: level?.name_english,
        lastActive: new Date(user.created_at).toLocaleDateString()
      };
    });

    setUserManagementData(userTableData);

    // Generate mock system logs
    const logs = [
      { id: 1, timestamp: new Date().toISOString(), type: 'info', message: 'System backup completed successfully', user: 'System' },
      { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'warning', message: 'High storage usage detected (85%)', user: 'System' },
      { id: 3, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'success', message: 'User authentication successful', user: 'admin@example.com' },
      { id: 4, timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'error', message: 'Failed login attempt detected', user: 'unknown' },
      { id: 5, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'info', message: 'Database maintenance completed', user: 'System' }
    ];

    setSystemLogs(logs);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsUserModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsUserModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Handle user deletion
        console.log('Deleting user:', userId);
      },
    });
  };

  const handleUserModalOk = () => {
    form.validateFields().then(values => {
      console.log('User data:', values);
      setIsUserModalVisible(false);
      form.resetFields();
    });
  };

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar>{text?.charAt(0)}</Avatar>
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.name_ur}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleColors = {
          'Saalik': 'blue',
          'Murabi': 'green',
          'Masool': 'orange',
          'Sheikh': 'purple',
          'Admin': 'red'
        };
        return <Tag color={roleColors[role]}>{role}</Tag>;
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level, record) => (
        <Space>
          <Tag>{level}</Tag>
          <Text type="secondary">{record.levelName}</Text>
        </Space>
      ),
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Entries',
      dataIndex: 'entriesCount',
      key: 'entriesCount',
      sorter: (a, b) => a.entriesCount - b.entriesCount,
    },
    {
      title: 'Avg Completion',
      dataIndex: 'avgCompletion',
      key: 'avgCompletion',
      render: (completion) => (
        <Progress 
          percent={completion} 
          size="small" 
          strokeColor={completion >= 80 ? colors.success : colors.warning}
        />
      ),
      sorter: (a, b) => a.avgCompletion - b.avgCompletion,
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEditUser(record)} />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={() => handleDeleteUser(record.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: colors.success }} />;
      case 'warning': return <ExclamationCircleOutlined style={{ color: colors.warning }} />;
      case 'error': return <ExclamationCircleOutlined style={{ color: colors.danger }} />;
      default: return <ExclamationCircleOutlined style={{ color: colors.primary }} />;
    }
  };

  const getHealthStatus = (status) => {
    const statusConfig = {
      healthy: { color: colors.success, text: 'Healthy' },
      warning: { color: colors.warning, text: 'Warning' },
      error: { color: colors.danger, text: 'Error' }
    };
    return statusConfig[status] || statusConfig.healthy;
  };

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <DashboardHeader />
      
      {/* System Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={systemStats.totalUsers}
              prefix={<UserOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={systemStats.activeUsers}
              prefix={<TeamOutlined style={{ color: colors.success }} />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Entries"
              value={systemStats.totalEntries}
              prefix={<DatabaseOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={systemStats.pendingReviews}
              prefix={<BarChartOutlined style={{ color: colors.warning }} />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>System Health</Title>
        <Row gutter={[16, 16]}>
          {systemStats.systemHealth && Object.entries(systemStats.systemHealth).map(([service, status]) => {
            const healthStatus = getHealthStatus(status);
            return (
              <Col xs={12} sm={6} key={service}>
                <Card size="small">
                  <Space>
                    <SecurityScanOutlined style={{ color: healthStatus.color }} />
                    <div>
                      <div style={{ textTransform: 'capitalize' }}>{service}</div>
                      <Text style={{ color: healthStatus.color, fontSize: 12 }}>
                        {healthStatus.text}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      <Tabs 
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "User Management",
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0 }}>User Management</Title>
                  <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Button icon={<ReloadOutlined />} onClick={loadSystemData}>Refresh</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                      Add User
                    </Button>
                  </Space>
                </div>
                <Table
                  columns={userColumns}
                  dataSource={userManagementData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            )
          },
          {
            key: "2",
            label: "Role Distribution",
            children: (
              <Row gutter={[16, 16]}>
                {systemStats.roleStats && Object.entries(systemStats.roleStats).map(([role, count]) => (
                  <Col xs={24} sm={12} lg={8} key={role}>
                    <Card>
                      <Statistic
                        title={role.charAt(0).toUpperCase() + role.slice(1)}
                        value={count}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: colors.primary }}
                      />
                      <Progress 
                        percent={Math.round((count / systemStats.totalUsers) * 100)} 
                        size="small" 
                        showInfo={false}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          },
          {
            key: "3",
            label: "System Logs",
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0 }}>System Activity Logs</Title>
                  <Button icon={<ReloadOutlined />} onClick={loadSystemData}>Refresh</Button>
                </div>
                <List
                  dataSource={systemLogs}
                  renderItem={(log) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={getLogTypeIcon(log.type)}
                        title={
                          <Space>
                            <span>{log.message}</span>
                            <Tag color={log.type === 'error' ? 'red' : log.type === 'warning' ? 'orange' : 'green'}>
                              {log.type.toUpperCase()}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space>
                            <Text type="secondary">
                              {new Date(log.timestamp).toLocaleString()}
                            </Text>
                            <Text type="secondary">•</Text>
                            <Text type="secondary">User: {log.user}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )
          },
          {
            key: "4",
            label: "System Settings",
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Application Settings">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Alert
                        message="Maintenance Mode"
                        description="Enable maintenance mode to perform system updates"
                        type="info"
                        action={
                          <Button size="small" type="text">
                            Configure
                          </Button>
                        }
                      />
                      <Divider />
                      <Space>
                        <Button icon={<SettingOutlined />}>Backup Settings</Button>
                        <Button icon={<DatabaseOutlined />}>Database Settings</Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Security Settings">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Alert
                        message="Security Status"
                        description="All security measures are active and functioning"
                        type="success"
                        action={
                          <Button size="small" type="text">
                            Review
                          </Button>
                        }
                      />
                      <Divider />
                      <Space>
                        <Button icon={<SecurityScanOutlined />}>Security Audit</Button>
                        <Button icon={<UserOutlined />}>Access Control</Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* User Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        visible={isUserModalVisible}
        onOk={handleUserModalOk}
        onCancel={() => setIsUserModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name (English)"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name_ur"
                label="Name (Urdu)"
                rules={[{ required: true, message: 'Please enter Urdu name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role' }]}
              >
                <Select>
                  <Option value="Saalik">Saalik</Option>
                  <Option value="Murabi">Murabi</Option>
                  <Option value="Masool">Masool</Option>
                  <Option value="Sheikh">Sheikh</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select>
                  {levelsData.levels.map(level => (
                    <Option key={level.level} value={level.level}>
                      Level {level.level} - {level.name_english}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="region"
                label="Region"
                rules={[{ required: true, message: 'Please enter region' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
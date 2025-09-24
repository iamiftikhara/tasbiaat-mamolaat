'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Table, Select, DatePicker, Space, Statistic, Progress, Tag, Modal, Form, Input } from 'antd';
import { SettingOutlined, UserOutlined, BarChartOutlined, SecurityScanOutlined, BellOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

export default function SheikhDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [systemModalVisible, setSystemModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();

  // Mock system overview data
  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalSubmissions: 2847,
    systemUptime: 99.8,
    avgResponseTime: 245,
    securityAlerts: 2
  };

  // Mock user management data
  const userData = [
    {
      id: 1,
      name: 'Ahmad Ali',
      role: 'Admin',
      region: 'Karachi',
      lastActive: '2024-01-15',
      status: 'active',
      permissions: ['user_management', 'system_config', 'reports']
    },
    {
      id: 2,
      name: 'Muhammad Hassan',
      role: 'Masool',
      region: 'Lahore',
      lastActive: '2024-01-14',
      status: 'active',
      permissions: ['weekly_reports', 'regional_oversight']
    },
    {
      id: 3,
      name: 'Ali Raza',
      role: 'Murabi',
      region: 'Islamabad',
      lastActive: '2024-01-13',
      status: 'inactive',
      permissions: ['saalik_review', 'daily_monitoring']
    }
  ];

  // Mock system logs
  const systemLogs = [
    {
      timestamp: '2024-01-15 10:30:00',
      type: 'security',
      message: 'Failed login attempt detected',
      severity: 'warning',
      user: 'unknown'
    },
    {
      timestamp: '2024-01-15 09:15:00',
      type: 'system',
      message: 'Database backup completed successfully',
      severity: 'info',
      user: 'system'
    },
    {
      timestamp: '2024-01-15 08:45:00',
      type: 'user',
      message: 'New user registration: Usman Khan',
      severity: 'info',
      user: 'admin'
    }
  ];

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div style={{ fontSize: '12px', color: theme.getColor('neutral', 500) }}>
            {record.region}
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          'Admin': 'red',
          'Masool': 'blue',
          'Murabi': 'green',
          'Saalik': 'orange'
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      }
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            type="primary"
          >
            Edit
          </Button>
        </Space>
      )
    }
  ];

  const logColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          'security': 'red',
          'system': 'blue',
          'user': 'green'
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => {
        const colors = {
          'info': 'blue',
          'warning': 'orange',
          'error': 'red'
        };
        return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
      }
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.getGradient('primary'),
      padding: '24px',
      fontFamily: theme.getFont('primary')
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              fontFamily: theme.getFont('display'),
              marginBottom: '8px'
            }}
          >
            Sheikh Dashboard
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
            System Oversight & Management
          </Text>
        </div>

        {/* Controls */}
        <Card 
          style={{
            borderRadius: theme.getRadius('xl'),
            marginBottom: '24px',
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Time Period</Text>
                <Select
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: '100%' }}
                >
                  <Option value="week">This Week</Option>
                  <Option value="month">This Month</Option>
                  <Option value="quarter">This Quarter</Option>
                  <Option value="year">This Year</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={16}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  type="primary" 
                  icon={<SettingOutlined />}
                  onClick={() => setSystemModalVisible(true)}
                >
                  System Settings
                </Button>
                <Button icon={<SecurityScanOutlined />}>
                  Security Audit
                </Button>
                <Button icon={<BarChartOutlined />}>
                  Analytics
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* System Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Total Users"
                value={systemStats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: theme.getColor('primary', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Active Users"
                value={systemStats.activeUsers}
                valueStyle={{ color: theme.getColor('success', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Total Submissions"
                value={systemStats.totalSubmissions}
                valueStyle={{ color: theme.getColor('secondary', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="System Uptime"
                value={systemStats.systemUptime}
                suffix="%"
                valueStyle={{ color: theme.getColor('success', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Avg Response"
                value={systemStats.avgResponseTime}
                suffix="ms"
                valueStyle={{ color: theme.getColor('warning', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Security Alerts"
                value={systemStats.securityAlerts}
                prefix={<BellOutlined />}
                valueStyle={{ color: theme.getColor('danger', 600) }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* User Management */}
          <Col xs={24} lg={14}>
            <Card 
              title="User Management"
              style={{
                borderRadius: theme.getRadius('xl'),
                boxShadow: theme.getShadow('card')
              }}
            >
              <Table
                columns={userColumns}
                dataSource={userData}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            </Card>
          </Col>

          {/* System Health */}
          <Col xs={24} lg={10}>
            <Card 
              title="System Health"
              style={{
                borderRadius: theme.getRadius('xl'),
                boxShadow: theme.getShadow('card')
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>Database Performance</Text>
                  <Progress percent={92} strokeColor={theme.getColor('success', 500)} />
                </div>
                <div>
                  <Text>Server Load</Text>
                  <Progress percent={45} strokeColor={theme.getColor('primary', 500)} />
                </div>
                <div>
                  <Text>Memory Usage</Text>
                  <Progress percent={67} strokeColor={theme.getColor('warning', 500)} />
                </div>
                <div>
                  <Text>Storage Usage</Text>
                  <Progress percent={34} strokeColor={theme.getColor('success', 500)} />
                </div>
                <div>
                  <Text>Network Latency</Text>
                  <Progress percent={23} strokeColor={theme.getColor('success', 500)} />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* System Logs */}
        <Card 
          title="Recent System Logs"
          style={{
            borderRadius: theme.getRadius('xl'),
            boxShadow: theme.getShadow('card'),
            marginTop: '24px'
          }}
        >
          <Table
            columns={logColumns}
            dataSource={systemLogs}
            rowKey="timestamp"
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>

        {/* System Settings Modal */}
        <Modal
          title="System Settings"
          open={systemModalVisible}
          onCancel={() => setSystemModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setSystemModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary">
              Save Changes
            </Button>
          ]}
          width={600}
        >
          <Form layout="vertical">
            <Form.Item label="System Name">
              <Input defaultValue="Tasbiaat Mamolaat System" />
            </Form.Item>
            <Form.Item label="Session Timeout (minutes)">
              <Input defaultValue="30" type="number" />
            </Form.Item>
            <Form.Item label="Max Login Attempts">
              <Input defaultValue="3" type="number" />
            </Form.Item>
            <Form.Item label="Backup Frequency">
              <Select defaultValue="daily">
                <Option value="hourly">Hourly</Option>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
              </Select>
            </Form.Item>
            <Form.Item label="System Announcement">
              <TextArea rows={3} placeholder="Enter system-wide announcement..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* User Details Modal */}
        <Modal
          title={`User Details: ${selectedUser?.name}`}
          open={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setUserModalVisible(false)}>
              Close
            </Button>
          ]}
          width={500}
        >
          {selectedUser && (
            <div>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Region:</strong> {selectedUser.region}</p>
              <p><strong>Last Active:</strong> {selectedUser.lastActive}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Permissions:</strong></p>
              <div>
                {selectedUser.permissions.map((permission, index) => (
                  <Tag key={index} style={{ marginBottom: '4px' }}>
                    {permission.replace('_', ' ').toUpperCase()}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
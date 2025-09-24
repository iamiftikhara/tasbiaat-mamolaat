'use client';

import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Space, 
  Badge, 
  Avatar, 
  List,
  Divider,
  Tag,
  Button,
  Timeline
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  TeamOutlined,
  DashboardOutlined,
  BarChartOutlined,
  CalendarOutlined,
  BellOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useMultilingual } from '../../hooks/useMultilingual';

const { Title, Text } = Typography;

const DashboardWidgets = ({ userRole, userStats }) => {
  const { currentLanguage, t } = useMultilingual();

  // Modern gradient card styles
  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: 'none',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  const statCardStyle = {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: 'none',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  // Get role-specific statistics
  const getStatsData = () => {
    switch (userRole) {
      case 'Saalik':
        return [
          {
            title: t('dashboard.stats.completedTasks', 'Completed Tasks'),
            value: userStats?.completedTasks || 42,
            change: '+12%',
            changeType: 'increase',
            icon: <CheckCircleOutlined />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
          },
          {
            title: t('dashboard.stats.pendingTasks', 'Pending Tasks'),
            value: userStats?.pendingTasks || 17,
            change: '+5%',
            changeType: 'increase',
            icon: <ClockCircleOutlined />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
          },
          {
            title: t('dashboard.stats.currentLevel', 'Current Level'),
            value: userStats?.currentLevel || 3,
            change: '+1',
            changeType: 'increase',
            icon: <TrophyOutlined />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
          },
          {
            title: t('dashboard.stats.spiritualProgress', 'Spiritual Progress'),
            value: `${userStats?.spiritualProgress || 65}%`,
            change: '+8%',
            changeType: 'increase',
            icon: <HeartOutlined />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
          }
        ];
      case 'Murabi':
        return [
          {
            title: t('dashboard.stats.totalStudents', 'Total Students'),
            value: userStats?.totalStudents || 25,
            change: '+3',
            changeType: 'increase',
            icon: <TeamOutlined />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
          },
          {
            title: t('dashboard.stats.activeStudents', 'Active Students'),
            value: userStats?.activeStudents || 22,
            change: '+2',
            changeType: 'increase',
            icon: <UserOutlined />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
          },
          {
            title: t('dashboard.stats.pendingReviews', 'Pending Reviews'),
            value: userStats?.pendingReviews || 8,
            change: '-2',
            changeType: 'decrease',
            icon: <ClockCircleOutlined />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
          },
          {
            title: t('dashboard.stats.completionRate', 'Completion Rate'),
            value: `${userStats?.completionRate || 85}%`,
            change: '+5%',
            changeType: 'increase',
            icon: <BarChartOutlined />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
          }
        ];
      case 'Masool':
        return [
          {
            title: t('dashboard.stats.totalMurabis', 'Total Murabis'),
            value: userStats?.totalMurabis || 15,
            change: '+2',
            changeType: 'increase',
            icon: <CrownOutlined />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
          },
          {
            title: t('dashboard.stats.activeMurabis', 'Active Murabis'),
            value: userStats?.activeMurabis || 14,
            change: '+1',
            changeType: 'increase',
            icon: <TeamOutlined />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
          },
          {
            title: t('dashboard.stats.regionProgress', 'Region Progress'),
            value: `${userStats?.regionProgress || 78}%`,
            change: '+12%',
            changeType: 'increase',
            icon: <RiseOutlined />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
          },
          {
            title: t('dashboard.stats.monthlyReports', 'Monthly Reports'),
            value: userStats?.monthlyReports || 12,
            change: '+3',
            changeType: 'increase',
            icon: <BarChartOutlined />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
          }
        ];
      case 'Admin':
        return [
          {
            title: t('dashboard.stats.totalUsers', 'Total Users'),
            value: userStats?.totalUsers || 1250,
            change: '+12%',
            changeType: 'increase',
            icon: <UserOutlined />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
          },
          {
            title: t('dashboard.stats.activeUsers', 'Active Users'),
            value: userStats?.activeUsers || 890,
            change: '+8%',
            changeType: 'increase',
            icon: <TeamOutlined />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
          },
          {
            title: t('dashboard.stats.systemHealth', 'System Health'),
            value: `${userStats?.systemHealth || 99.9}%`,
            change: '+0.1%',
            changeType: 'increase',
            icon: <HeartOutlined />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
          },
          {
            title: t('dashboard.stats.performance', 'Performance'),
            value: `${userStats?.performance || 95}%`,
            change: 'Excellent',
            changeType: 'stable',
            icon: <ThunderboltOutlined />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
          }
        ];
      default:
        return [];
    }
  };

  const statsData = getStatsData();

  // Recent activities data
  const getRecentActivities = () => {
    const baseActivities = [
      {
        id: 1,
        user: 'Ahmad Ali',
        action: 'Completed daily entry',
        time: '2 hours ago',
        type: 'success',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      },
      {
        id: 2,
        user: 'Fatima Khan',
        action: 'Submitted weekly report',
        time: '4 hours ago',
        type: 'info',
        icon: <BookOutlined style={{ color: '#1890ff' }} />
      },
      {
        id: 3,
        user: 'Muhammad Hassan',
        action: 'Achieved Level 2',
        time: '1 day ago',
        type: 'warning',
        icon: <TrophyOutlined style={{ color: '#faad14' }} />
      },
      {
        id: 4,
        user: 'Aisha Rahman',
        action: 'Started new spiritual practice',
        time: '2 days ago',
        type: 'success',
        icon: <StarOutlined style={{ color: '#722ed1' }} />
      }
    ];

    return baseActivities;
  };

  // Progress data for Saalik
  const getProgressData = () => {
    if (userRole === 'Saalik') {
      return [
        { 
          label: t('dashboard.progress.farayz', 'Farayz'), 
          value: userStats?.farayzProgress || 85,
          color: '#52c41a'
        },
        { 
          label: t('dashboard.progress.quran', 'Quran'), 
          value: userStats?.quranProgress || 60,
          color: '#1890ff'
        },
        { 
          label: t('dashboard.progress.zikr', 'Zikr'), 
          value: userStats?.zikrProgress || 75,
          color: '#722ed1'
        },
        { 
          label: t('dashboard.progress.nawafil', 'Nawafil'), 
          value: userStats?.nawafilProgress || 40,
          color: '#faad14'
        }
      ];
    }
    return [];
  };

  const progressData = getProgressData();
  const recentActivities = getRecentActivities();

  return (
    <div style={{ padding: '0', background: '#f5f7fa' }}>
      {/* Welcome Header */}
      <Card 
        style={{
          ...cardStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '24px',
          color: 'white'
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              {t('dashboard.welcome', 'Welcome back!')} 👋
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              {t('dashboard.subtitle', 'Here\'s what\'s happening with your spiritual journey today.')}
            </Text>
          </Col>
          <Col>
            <div style={{ textAlign: 'center' }}>
              <FireOutlined style={{ fontSize: '48px', color: '#ffa940' }} />
              <div style={{ color: 'white', marginTop: '8px' }}>
                <Text style={{ color: 'white', fontSize: '14px' }}>
                  {t('dashboard.streak', 'Current Streak')}
                </Text>
                <br />
                <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  7 days
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                ...statCardStyle,
                background: stat.gradient,
                color: 'white'
              }}
              styles={{ body: { padding: '24px' } }}
              hoverable
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '32px', 
                    marginBottom: '8px',
                    color: 'white'
                  }}>
                    {stat.icon}
                  </div>
                  <Title level={3} style={{ color: 'white', margin: 0, fontSize: '28px' }}>
                    {stat.value}
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                    {stat.title}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpOutlined />
                      ) : stat.changeType === 'decrease' ? (
                        <ArrowDownOutlined />
                      ) : null}
                      {stat.change}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Progress Section (for Saalik) */}
        {userRole === 'Saalik' && progressData.length > 0 && (
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChartOutlined style={{ color: '#1890ff' }} />
                  {t('dashboard.progress.title', 'Spiritual Progress')}
                </div>
              }
              style={statCardStyle}
              styles={{ body: { padding: '24px' } }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px' 
                    }}>
                      <Text strong>{item.label}</Text>
                      <Text>{item.value}%</Text>
                    </div>
                    <Progress 
                      percent={item.value} 
                      strokeColor={item.color}
                      trailColor="#f0f0f0"
                      strokeWidth={8}
                      showInfo={false}
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        )}

        {/* Recent Activities */}
        <Col xs={24} lg={userRole === 'Saalik' ? 12 : 24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined style={{ color: '#1890ff' }} />
                {t('dashboard.activities.title', 'Recent Activities')}
              </div>
            }
            style={statCardStyle}
            styles={{ body: { padding: '24px' } }}
            extra={
              <Button type="link" size="small">
                {t('dashboard.activities.viewAll', 'View All')}
              </Button>
            }
          >
            <Timeline
              items={recentActivities.map(activity => ({
                dot: activity.icon,
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{activity.user}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.time}
                      </Text>
                    </div>
                    <Text type="secondary">{activity.action}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThunderboltOutlined style={{ color: '#1890ff' }} />
            {t('dashboard.quickActions.title', 'Quick Actions')}
          </div>
        }
        style={{ ...statCardStyle, marginTop: '24px' }}
        styles={{ body: { padding: '24px' } }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<BookOutlined />}
              style={{ 
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              {t('dashboard.actions.newEntry', 'New Entry')}
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<CalendarOutlined />}
              style={{ 
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none'
              }}
            >
              {t('dashboard.actions.schedule', 'Schedule')}
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<BarChartOutlined />}
              style={{ 
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none'
              }}
            >
              {t('dashboard.actions.reports', 'Reports')}
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<UserOutlined />}
              style={{ 
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                border: 'none'
              }}
            >
              {t('dashboard.actions.profile', 'Profile')}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardWidgets;
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Calendar, Badge, Typography, Space, Divider } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined,
  BookOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useMultilingual } from '../../hooks/useMultilingual';
import SaalikDashboard from './SaalikDashboard';
import MurabiDashboard from './MurabiDashboard';
import MasoolDashboard from './MasoolDashboard';
import SheikhDashboard from './SheikhDashboard';
import AdminDashboard from './AdminDashboard';

const { Title, Text } = Typography;

const Dashboard = ({ user, userRole }) => {
  const { t, isRTL, getCurrentFont, colors } = useMultilingual();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get Islamic time information
  const getIslamicTimeInfo = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 4 && hours < 6) return { prayer: 'فجر', time: 'Fajr Time', color: '#52c41a' };
    if (hours >= 6 && hours < 12) return { prayer: 'ضحیٰ', time: 'Duha Time', color: '#faad14' };
    if (hours >= 12 && hours < 15) return { prayer: 'ظہر', time: 'Zuhr Time', color: '#1890ff' };
    if (hours >= 15 && hours < 18) return { prayer: 'عصر', time: 'Asr Time', color: '#722ed1' };
    if (hours >= 18 && hours < 20) return { prayer: 'مغرب', time: 'Maghrib Time', color: '#f5222d' };
    if (hours >= 20 || hours < 4) return { prayer: 'عشاء', time: 'Isha Time', color: '#13c2c2' };
    
    return { prayer: 'وقت', time: 'Time', color: '#666' };
  };

  const islamicTime = getIslamicTimeInfo();

  // Common header component for all dashboards
  const DashboardHeader = () => (
    <div style={{ 
      marginBottom: 24,
      fontFamily: getCurrentFont('primary'),
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Space direction="vertical" size={0}>
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              {t('navigation.dashboard')}
            </Title>
            <Text type="secondary">
              {t('auth.welcome')}, {user?.name || 'User'}
            </Text>
          </Space>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: isRTL ? 'left' : 'right' }}>
          <Card size="small" style={{ display: 'inline-block' }}>
            <Space>
              <Badge color={islamicTime.color} />
              <Text strong>{islamicTime.prayer}</Text>
              <Divider type="vertical" />
              <Text>{currentTime.toLocaleTimeString()}</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render role-specific dashboard
  const renderRoleDashboard = () => {
    const commonProps = {
      user,
      userRole,
      DashboardHeader,
      colors,
      isRTL,
      getCurrentFont,
      t
    };

    switch (userRole?.toLowerCase()) {
      case 'saalik':
        return <SaalikDashboard {...commonProps} />;
      case 'murabi':
        return <MurabiDashboard {...commonProps} />;
      case 'masool':
        return <MasoolDashboard {...commonProps} />;
      case 'sheikh':
        return <SheikhDashboard {...commonProps} />;
      case 'admin':
        return <AdminDashboard {...commonProps} />;
      default:
        return (
          <div style={{ fontFamily: getCurrentFont('primary') }}>
            <DashboardHeader />
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <UserOutlined style={{ fontSize: 48, color: colors.text.secondary, marginBottom: 16 }} />
                <Title level={4}>{t('messages.noData')}</Title>
                <Text type="secondary">
                  Role-specific dashboard not configured for: {userRole}
                </Text>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: getCurrentFont('primary')
    }}>
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
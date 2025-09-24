'use client';

import React, { useContext, useEffect, useState } from 'react';
import { ConfigProvider, Spin, Row, Col, Space, Typography, Card, Badge, Divider } from 'antd';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import { useMultilingual } from '../../hooks/useMultilingual';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardWidgets from '../../components/Dashboard/DashboardWidgets';
import RoleGuard from '../../components/RoleGuard';
import { ComponentLoader, SkeletonLoaders } from '@/components/Loaders';

// Import existing role-specific dashboards
import SaalikDashboard from '../../components/Dashboard/SaalikDashboard';
import MurabiDashboard from '../../components/Dashboard/MurabiDashboard';
import MasoolDashboard from '../../components/Dashboard/MasoolDashboard';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';

const { Title, Text } = Typography;

const DashboardContent = () => {
  const { user, loading } = useContext(AuthContext);
  const { t, isRTL, getCurrentFont, colors } = useMultilingual();
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Load user statistics based on role
    const loadUserStats = async () => {
      setStatsLoading(true);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // For now, we'll use mock data based on user role
      const mockStats = {
        'Saalik': {
          completedTasks: 42,
          pendingTasks: 17,
          missedTasks: 5,
          currentLevel: user?.level || 1,
          spiritualProgress: 65,
          farayzProgress: 85,
          quranProgress: 60,
          zikrProgress: 75,
          nawafilProgress: 40
        },
        'Murabi': {
          totalStudents: 25,
          activeStudents: 22,
          pendingReviews: 8,
          completionRate: 85
        },
        'Masool': {
          totalMurabis: 15,
          activeMurabis: 14,
          regionProgress: 78,
          monthlyReports: 12
        },
        'Admin': {
          totalUsers: 1250,
          activeUsers: 890,
          systemHealth: 99.9,
          performance: 95
        }
      };

      setUserStats(mockStats[user?.role] || {});
      setStatsLoading(false);
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <SkeletonLoaders.Dashboard />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Common header component for all dashboards
  const DashboardHeader = () => {
    const currentTime = new Date();
    const islamicTime = {
      prayer: 'Maghrib',
      color: '#52c41a'
    };

    return (
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
  };

  const renderRoleSpecificContent = () => {
    const commonProps = {
      user,
      userRole: user.role,
      DashboardHeader,
      getCurrentFont,
      colors,
      isRTL,
      t
    };

    switch (user?.role) {
      case 'Saalik':
        return <SaalikDashboard {...commonProps} />;
      case 'Murabi':
        return <MurabiDashboard {...commonProps} />;
      case 'Masool':
        return <MasoolDashboard {...commonProps} />;
      case 'Admin':
        return <AdminDashboard {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Main Dashboard Widgets */}
        {statsLoading ? (
          <div className="space-y-6">
            <SkeletonLoaders.Card />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkeletonLoaders.Widget />
              <SkeletonLoaders.Widget />
              <SkeletonLoaders.Widget />
              <SkeletonLoaders.Widget />
            </div>
            <SkeletonLoaders.Chart />
          </div>
        ) : (
          <DashboardWidgets userRole={user?.role} userStats={userStats} />
        )}
        
        {/* Role-specific content */}
        <div className="mt-8 relative">
          {statsLoading ? (
            <ComponentLoader 
              variant="content" 
              message="جاري تحميل المحتوى الخاص بالدور..."
              size="large"
            />
          ) : (
            renderRoleSpecificContent()
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const DashboardPage = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <RoleGuard allowedRoles={['Saalik', 'Murabi', 'Masool', 'Admin']}>
          <DashboardContent />
        </RoleGuard>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default DashboardPage;
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from '@/components/RoleGuard';
import Link from 'next/link';
import { 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Avatar, 
  List,
  Progress,
  Tabs,
  Badge
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MurabiDashboard = () => {
  const { user, apiCall } = useAuth();
  const [saaliks, setSaaliks] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [stats, setStats] = useState({
    totalSaaliks: 0,
    activeToday: 0,
    pendingReviews: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Murabi Dashboard',
      welcome: 'Welcome',
      mySaaliks: 'My Saaliks',
      pendingReviews: 'Pending Reviews',
      totalSaaliks: 'Total Saaliks',
      activeToday: 'Active Today',
      averageProgress: 'Average Progress',
      viewAll: 'View All',
      review: 'Review',
      addComment: 'Add Comment',
      updateLevel: 'Update Level',
      noSaaliks: 'No Saaliks assigned yet',
      noPending: 'No pending reviews',
      recentActivity: 'Recent Activity',
      level: 'Level',
      lastEntry: 'Last Entry',
      progress: 'Progress',
      status: 'Status'
    },
    ur: {
      title: 'مربی ڈیش بورڈ',
      welcome: 'خوش آمدید',
      mySaaliks: 'میرے سالک',
      pendingReviews: 'زیر التواء جائزے',
      totalSaaliks: 'کل سالک',
      activeToday: 'آج فعال',
      averageProgress: 'اوسط پیش قدمی',
      viewAll: 'سب دیکھیں',
      review: 'جائزہ',
      addComment: 'تبصرہ شامل کریں',
      updateLevel: 'لیول اپ ڈیٹ کریں',
      noSaaliks: 'ابھی تک کوئی سالک تفویض نہیں',
      noPending: 'کوئی زیر التواء جائزہ نہیں',
      recentActivity: 'حالیہ سرگرمی',
      level: 'لیول',
      lastEntry: 'آخری اندراج',
      progress: 'پیش قدمی',
      status: 'حالت'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch assigned Saaliks
        const saliksData = await apiCall('/api/murabi/saaliks');
        setSaaliks(saliksData.saaliks);
        
        // Fetch pending reviews
        const reviewsData = await apiCall('/api/murabi/pending-reviews');
        setPendingReviews(reviewsData.reviews);
        
        // Fetch statistics
        const statsData = await apiCall('/api/murabi/stats');
        setStats(statsData.stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, apiCall]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['murabi']}>
      <div className={`${language === 'ur' ? 'rtl font-urdu' : 'ltr'}`}>
        {/* Header */}
        <Card className="!bg-gradient-to-r !from-blue-900 !via-blue-800 !to-indigo-900 !border-0 !text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title level={1} className="!text-white !mb-2">
                <TeamOutlined className="mr-3" />
                {t.title}
              </Title>
              <Text className="!text-blue-100 !text-lg">
                {t.welcome}, <span className="!text-white !font-semibold">{user?.name || 'Murabi'}</span>
              </Text>
            </div>
            <div className="hidden md:block text-right">
              <Text className="!text-blue-200">{new Date().toLocaleDateString()}</Text>
              <br />
              <Text className="!text-white !text-lg !font-bold">
                {t.totalSaaliks}: {stats.totalSaaliks}
              </Text>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">{t.totalSaaliks}</span>}
                value={stats.totalSaaliks}
                prefix={<TeamOutlined className="!text-blue-600" />}
                valueStyle={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">{t.pendingReviews}</span>}
                value={stats.pendingReviews}
                prefix={<ClockCircleOutlined className="!text-orange-600" />}
                valueStyle={{ color: '#ea580c', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">{t.activeToday}</span>}
                value={stats.activeToday}
                prefix={<CheckCircleOutlined className="!text-green-600" />}
                valueStyle={{ color: '#16a34a', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">{t.averageProgress}</span>}
                value={stats.averageProgress}
                suffix="%"
                prefix={<TrophyOutlined className="!text-purple-600" />}
                valueStyle={{ color: '#9333ea', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]} className="mb-8">
          {/* Pending Reviews */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined className="!text-orange-600" />
                  <span className="!font-bold !text-slate-800">{t.pendingReviews}</span>
                </Space>
              }
              extra={
                pendingReviews && pendingReviews.length > 0 && (
                  <Badge count={pendingReviews.length} className="!bg-orange-500">
                    <span className="text-sm font-bold text-orange-800">pending</span>
                  </Badge>
                )
              }
              className="shadow-lg"
            >
              {pendingReviews && pendingReviews.length > 0 ? (
                <List
                  dataSource={pendingReviews.slice(0, 5)}
                  renderItem={(entry, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <Button key="review" type="primary" size="small" icon={<EyeOutlined />}>
                          {t.review}
                        </Button>
                      ]}
                      className="!border-0 !bg-gradient-to-r !from-slate-50 !to-orange-50 !rounded-xl !mb-3 !p-4 hover:!shadow-md transition-all duration-200"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            className="!bg-orange-100 !text-orange-600 !font-semibold"
                            size={40}
                          >
                            {entry.saalik_name.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Text className="!font-semibold !text-slate-800">
                            {entry.saalik_name}
                          </Text>
                        }
                        description={
                          <Text className="!text-slate-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                  footer={
                    pendingReviews.length > 5 && (
                      <div className="text-center">
                        <Button type="link" className="!text-blue-600 hover:!text-blue-800 !font-semibold">
                          {t.viewAll} ({pendingReviews.length - 5} more)
                        </Button>
                      </div>
                    )
                  }
                />
              ) : (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleOutlined className="text-4xl text-emerald-600" />
                  </div>
                  <Text className="!text-slate-600 !text-lg">{t.noPending}</Text>
                </div>
              )}
            </Card>
          </Col>

          {/* My Saaliks */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <UserOutlined className="!text-blue-600" />
                  <span className="!font-bold !text-slate-800">{t.mySaaliks}</span>
                </Space>
              }
              className="shadow-lg"
            >
              {saaliks && saaliks.length > 0 ? (
                <List
                  dataSource={saaliks.slice(0, 5)}
                  renderItem={(saalik, index) => (
                    <List.Item
                      key={index}
                      className="!border-0 !bg-gradient-to-r !from-slate-50 !to-blue-50 !rounded-xl !mb-3 !p-4 hover:!shadow-md transition-all duration-200"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            className="!bg-blue-100 !text-blue-600 !font-bold"
                            size={48}
                          >
                            {saalik.name.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Text className="!font-semibold !text-slate-800">
                            {saalik.name}
                          </Text>
                        }
                        description={
                          <Text className="!text-slate-500">
                            {t.level} {saalik.level}
                          </Text>
                        }
                      />
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Text className="!text-sm !text-slate-500">{t.progress}</Text>
                          <br />
                          <Text className="!text-lg !font-bold !text-slate-800">
                            {saalik.progress}%
                          </Text>
                        </div>
                        <div className={`h-4 w-4 rounded-full ${
                          saalik.isActive ? 'bg-emerald-400' : 'bg-slate-300'
                        }`}></div>
                      </div>
                    </List.Item>
                  )}
                  footer={
                    saaliks.length > 5 && (
                      <div className="text-center">
                        <Button type="link" className="!text-blue-600 hover:!text-blue-800 !font-semibold">
                          {t.viewAll} ({saaliks.length - 5} more)
                        </Button>
                      </div>
                    )
                  }
                />
              ) : (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TeamOutlined className="text-4xl text-blue-600" />
                  </div>
                  <Text className="!text-slate-600 !text-lg">{t.noSaaliks}</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <div className="card shadow-modern">
          <div className="card-header">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <span className="mr-3">📊</span>
              {t.recentActivity}
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Sample recent activities */}
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-emerald-100">
                  <span className="text-xl">📝</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium">
                  <span className="font-bold text-blue-800">Ahmad Ali</span>
                  {' '}submitted daily entry
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  2 hours ago
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="status-indicator status-success">
                  entry
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100">
                  <span className="text-xl">✅</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium">
                  <span className="font-bold text-blue-800">Fatima Khan</span>
                  {' '}reached Level 2
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  5 hours ago
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="status-indicator status-info">
                  review
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-slate-100">
                  <span className="text-xl">📊</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium">
                  <span className="font-bold text-blue-800">Muhammad Hassan</span>
                  {' '}needs review
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  1 day ago
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="status-indicator status-default">
                  pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default MurabiDashboard;
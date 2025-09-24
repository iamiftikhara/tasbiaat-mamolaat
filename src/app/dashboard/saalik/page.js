'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import RoleGuard from '../../../components/RoleGuard';
import Link from 'next/link';
import { Card, Statistic, Progress, Button, List, Avatar, Tag, Typography, Row, Col, Space, Divider } from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  AimOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SaalikDashboard = () => {
  const { user, apiCall } = useAuth();
  const [todayEntry, setTodayEntry] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data for demonstration - replace with actual API calls when backend is ready
        
        // Mock today's entry status
        const today = new Date().toISOString().split('T')[0];
        const mockTodayEntry = {
          id: 1,
          date: today,
          completed: Math.random() > 0.5, // Random completion status
          completionPercentage: Math.floor(Math.random() * 100)
        };
        setTodayEntry(mockTodayEntry);
        
        // Mock recent entries
        const mockRecentEntries = [
          {
            id: 1,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: true,
            level: 1,
            completionPercentage: 85
          },
          {
            id: 2,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: true,
            level: 1,
            completionPercentage: 92
          },
          {
            id: 3,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false,
            level: 1,
            completionPercentage: 45
          },
          {
            id: 4,
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: true,
            level: 1,
            completionPercentage: 78
          },
          {
            id: 5,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: true,
            level: 1,
            completionPercentage: 88
          }
        ];
        setRecentEntries(mockRecentEntries);
        
        // Mock current level
        setLevel(1);
        
        // TODO: Replace with actual API calls:
        // const todayData = await apiCall('/api/saalik/today-entry');
        // setTodayEntry(todayData.entry);
        // const recentData = await apiCall('/api/saalik/recent-entries', { limit: 5 });
        // setRecentEntries(recentData.entries);
        // const levelData = await apiCall('/api/saalik/level');
        // setLevel(levelData.level);
        
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

  const getLevelName = (level) => {
    const levels = {
      1: 'Beginner - ابتدائی',
      2: 'Intermediate - درمیانی', 
      3: 'Advanced - اعلیٰ',
      4: 'Expert - ماہر'
    };
    return levels[level] || `Level ${level}`;
  };

  const getProgressPercentage = () => {
    // Calculate based on recent entries completion
    if (recentEntries.length === 0) return 0;
    const completedEntries = recentEntries.filter(entry => entry.completed).length;
    return Math.round((completedEntries / recentEntries.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['saalik']}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <Card className="!bg-gradient-to-r !from-blue-900 !via-blue-800 !to-indigo-900 !border-0 !text-white">
          <div className="flex items-center justify-between">
            <div>
              <Title level={1} className="!text-white !mb-2">
                Welcome, {user?.name} - خوش آمدید
              </Title>
              <Text className="!text-blue-100 !text-lg">
                Current Level: <span className="text-blue-200 font-semibold">{getLevelName(level)}</span>
              </Text>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <Text className="!text-blue-200">{new Date().toLocaleDateString()}</Text>
                <br />
                <Text className="!text-white !text-lg !font-semibold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Row gutter={[24, 24]}>
          {/* Today's Entry */}
          <Col xs={24} md={8}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">Today's Entry - آج کا اندراج</span>}
                value={todayEntry ? 'Completed - مکمل' : 'Pending - باقی'}
                prefix={todayEntry ? <CheckCircleOutlined className="!text-emerald-600" /> : <BookOutlined className="!text-blue-600" />}
                valueStyle={{ color: todayEntry ? '#059669' : '#2563eb', fontSize: '1.125rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Link href="/dashboard/saalik/entry">
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    className={todayEntry ? '!bg-emerald-600 hover:!bg-emerald-700' : '!bg-blue-600 hover:!bg-blue-700'}
                  >
                    {todayEntry ? 'View Entry - اندراج دیکھیں' : 'Make Entry - اندراج کریں'}
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>

          {/* Progress */}
          <Col xs={24} md={8}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">Progress - پیش قدمی</span>}
                value={getProgressPercentage()}
                suffix="%"
                prefix={<AimOutlined className="!text-blue-600" />}
                valueStyle={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text className="!text-slate-500">this week</Text>
              <div className="mt-4">
                <Progress 
                  percent={getProgressPercentage()} 
                  strokeColor={{
                    '0%': '#3b82f6',
                    '100%': '#1d4ed8',
                  }}
                  className="!mb-3"
                />
                <Link href="/dashboard/saalik/progress">
                  <Button type="link" className="!p-0 !text-blue-600 hover:!text-blue-800">
                    View Details - تفصیلات دیکھیں →
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>

          {/* History */}
          <Col xs={24} md={8}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <Statistic
                title={<span className="!font-semibold !text-slate-600">History - تاریخ</span>}
                value={recentEntries.length}
                prefix={<CalendarOutlined className="!text-purple-600" />}
                valueStyle={{ color: '#9333ea', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text className="!text-slate-500">recent entries</Text>
              <div className="mt-4">
                <Link href="/dashboard/saalik/history">
                  <Button size="large" block>
                    View History - تاریخ دیکھیں
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card 
          title={
            <Space>
              <BookOutlined className="!text-blue-600" />
              <span className="!font-bold !text-slate-800">Recent Activity - حالیہ سرگرمی</span>
            </Space>
          }
          className="shadow-lg"
        >
          {recentEntries.length > 0 ? (
            <List
              dataSource={recentEntries}
              renderItem={(entry, index) => (
                <List.Item
                  className="!border-0 !bg-gradient-to-r !from-slate-50 !to-blue-50 !rounded-xl !mb-3 !p-4 hover:!shadow-md transition-all duration-200"
                >
                  <List.Item.Meta
                    avatar={
                      <div className={`w-4 h-4 rounded-full ${
                        entry.completed ? 'bg-emerald-400' : 'bg-red-400'
                      }`}></div>
                    }
                    title={
                      <Text className="!font-medium !text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </Text>
                    }
                    description={
                      <Space>
                        <Tag 
                          color={entry.completed ? 'success' : 'error'}
                          icon={entry.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        >
                          {entry.completed ? 'Completed' : 'Incomplete'}
                        </Tag>
                        <Text className="!text-gray-500">Level {entry.level}</Text>
                      </Space>
                    }
                  />
                  <div className="text-sm font-semibold text-slate-600">
                    {entry.completionPercentage}%
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-12">
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOutlined className="!text-4xl !text-blue-600" />
              </div>
              <Title level={4} className="!text-slate-600 !mb-6">
                No entries yet. Start your spiritual journey today!
                <br />
                ابھی تک کوئی اندراج نہیں۔ آج ہی اپنا روحانی سفر شروع کریں!
              </Title>
              <Link href="/dashboard/saalik/entry">
                <Button type="primary" size="large" icon={<PlusOutlined />}>
                  Make First Entry - پہلا اندراج کریں
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </RoleGuard>
  );
};

export default SaalikDashboard;
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Calendar, 
  Badge, 
  Typography, 
  Space, 
  Button,
  List,
  Avatar,
  Tag,
  Divider,
  Alert
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined,
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  PlusOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons';

// Import dummy data
import usersData from '../../data/users.json';
import levelsData from '../../data/levels.json';
import entriesData from '../../data/entries.json';

const { Title, Text, Paragraph } = Typography;

const SaalikDashboard = ({ user, DashboardHeader, colors, isRTL, getCurrentFont, t }) => {
  const [todayEntry, setTodayEntry] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load user's current level
    const userLevel = levelsData.levels.find(level => level.level === user?.level || 0);
    setCurrentLevel(userLevel);

    // Load today's entry
    const today = new Date().toISOString().split('T')[0];
    const todayEntryData = entriesData.daily_entries.find(
      entry => entry.user_id === user?.id && entry.date === today
    );
    setTodayEntry(todayEntryData);

    // Calculate weekly progress
    const thisWeek = entriesData.daily_entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entry.user_id === user?.id && entryDate >= weekAgo;
    });
    
    const avgCompletion = thisWeek.length > 0 
      ? thisWeek.reduce((sum, entry) => sum + entry.completion_percentage, 0) / thisWeek.length 
      : 0;
    setWeeklyProgress(Math.round(avgCompletion));

    // Load recent entries
    const userEntries = entriesData.daily_entries
      .filter(entry => entry.user_id === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentEntries(userEntries);

    // Calculate streak
    let currentStreak = 0;
    const sortedEntries = entriesData.daily_entries
      .filter(entry => entry.user_id === user?.id && entry.completion_percentage >= 80)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [user]);

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return colors.success;
    if (percentage >= 70) return colors.warning;
    return colors.danger;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { color: 'blue', text: t('actions.submit') },
      'approved': { color: 'green', text: t('actions.approve') },
      'pending': { color: 'orange', text: 'Pending' },
      'rejected': { color: 'red', text: t('actions.reject') }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return <Badge color={config.color} text={config.text} />;
  };

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <DashboardHeader />
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('categories.farayz.title')}
              value={todayEntry?.categories?.farayz?.completed || 0}
              suffix={`/ ${todayEntry?.categories?.farayz?.total || 5}`}
              prefix={<CheckCircleOutlined style={{ color: colors.success }} />}
              valueStyle={{ color: getCompletionColor((todayEntry?.categories?.farayz?.completed || 0) / 5 * 100) }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('categories.zikr.title')}
              value={weeklyProgress}
              suffix="%"
              prefix={<HeartOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: getCompletionColor(weeklyProgress) }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Streak"
              value={streak}
              suffix="days"
              prefix={<FireOutlined style={{ color: colors.warning }} />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Level"
              value={currentLevel?.level || 0}
              prefix={<StarOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {currentLevel?.name_ur || 'ابتدائی'}
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Today's Progress */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Today's Progress</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="small"
              >
                {todayEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            }
          >
            {todayEntry ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Overall Completion: </Text>
                  <Progress 
                    percent={todayEntry.completion_percentage} 
                    strokeColor={getCompletionColor(todayEntry.completion_percentage)}
                    size="small"
                  />
                </div>
                
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Prayers: </Text>
                    <Progress 
                      percent={(todayEntry.categories?.farayz?.completed || 0) / 5 * 100} 
                      size="small"
                      showInfo={false}
                    />
                    <Text type="secondary">
                      {todayEntry.categories?.farayz?.completed || 0}/5
                    </Text>
                  </div>
                  
                  <div>
                    <Text>Quran: </Text>
                    <Progress 
                      percent={(todayEntry.categories?.quran_tilawat?.completed || 0) / 4 * 100} 
                      size="small"
                      showInfo={false}
                    />
                    <Text type="secondary">
                      {todayEntry.categories?.quran_tilawat?.completed || 0}/4
                    </Text>
                  </div>
                  
                  <div>
                    <Text>Remembrance: </Text>
                    <Progress 
                      percent={(todayEntry.categories?.zikr?.completed || 0) / 6 * 100} 
                      size="small"
                      showInfo={false}
                    />
                    <Text type="secondary">
                      {todayEntry.categories?.zikr?.completed || 0}/6
                    </Text>
                  </div>
                </Space>

                <Divider />
                <div>
                  <Text type="secondary">Status: </Text>
                  {getStatusBadge(todayEntry.status)}
                </div>
                
                {todayEntry.murabi_comment && (
                  <Alert
                    message="Murabi's Comment"
                    description={todayEntry.murabi_comment}
                    type="info"
                    showIcon
                    style={{ marginTop: 12 }}
                  />
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <ClockCircleOutlined style={{ fontSize: 32, color: colors.text.secondary, marginBottom: 8 }} />
                <Paragraph type="secondary">
                  No entry for today yet. Start your spiritual journey!
                </Paragraph>
              </div>
            )}
          </Card>
        </Col>

        {/* Current Level Info */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>Current Level</span>
              </Space>
            }
          >
            {currentLevel ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={64} 
                    style={{ 
                      backgroundColor: currentLevel.color_code,
                      fontSize: 24
                    }}
                  >
                    {currentLevel.level}
                  </Avatar>
                  <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                    {currentLevel.name_ur}
                  </Title>
                  <Text type="secondary">{currentLevel.name_en}</Text>
                </div>
                
                <Paragraph style={{ textAlign: 'center', fontSize: 12 }}>
                  {currentLevel.description_ur}
                </Paragraph>
                
                <Divider />
                
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Duration: </Text>
                    <Text>{currentLevel.duration_months} months</Text>
                  </div>
                  <div>
                    <Text strong>Daily Prayers: </Text>
                    <Text>{currentLevel.requirements.prayers}</Text>
                  </div>
                  <div>
                    <Text strong>Quran: </Text>
                    <Text>{currentLevel.requirements.quran}</Text>
                  </div>
                  <div>
                    <Text strong>Remembrance: </Text>
                    <Text>{currentLevel.requirements.zikr}</Text>
                  </div>
                </Space>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <BookOutlined style={{ fontSize: 32, color: colors.text.secondary, marginBottom: 8 }} />
                <Paragraph type="secondary">
                  Level information not available
                </Paragraph>
              </div>
            )}
          </Card>
        </Col>

        {/* Recent Entries */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Recent Entries</span>
              </Space>
            }
          >
            <List
              dataSource={recentEntries}
              renderItem={(entry) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: getCompletionColor(entry.completion_percentage),
                          color: 'white'
                        }}
                      >
                        {entry.completion_percentage}%
                      </Avatar>
                    }
                    title={
                      <Space>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        {getStatusBadge(entry.status)}
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">
                          Prayers: {entry.categories?.farayz?.completed || 0}/5
                        </Text>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          Quran: {entry.categories?.quran_tilawat?.completed || 0}/4
                        </Text>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          Zikr: {entry.categories?.zikr?.completed || 0}/6
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SaalikDashboard;
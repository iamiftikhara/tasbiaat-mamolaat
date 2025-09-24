import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Badge, 
  Typography, 
  Space, 
  Button,
  List,
  Avatar,
  Tag,
  Progress,
  Modal,
  Input,
  message,
  Tabs
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';

// Import dummy data
import usersData from '../../data/users.json';
import levelsData from '../../data/levels.json';
import entriesData from '../../data/entries.json';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MurabiDashboard = ({ user, DashboardHeader, colors, isRTL, getCurrentFont, t }) => {
  const [mySaaliks, setMySaaliks] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [comment, setComment] = useState('');
  const [stats, setStats] = useState({
    totalSaaliks: 0,
    pendingReviews: 0,
    approvedToday: 0,
    averageCompletion: 0
  });

  useEffect(() => {
    // Load Saaliks assigned to this Murabi
    const assignedSaaliks = usersData.filter(u => 
      u.role === 'Saalik' && u.murabi_id === user?.id
    );
    setMySaaliks(assignedSaaliks);

    // Load pending reviews
    const pending = entriesData.daily_entries.filter(entry => {
      const saalik = usersData.find(u => u.id === entry.user_id);
      return saalik?.murabi_id === user?.id && entry.status === 'submitted';
    });
    setPendingReviews(pending);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayApproved = entriesData.daily_entries.filter(entry => {
      const saalik = usersData.find(u => u.id === entry.user_id);
      return saalik?.murabi_id === user?.id && 
             entry.status === 'approved' && 
             entry.date === today;
    }).length;

    const allEntries = entriesData.daily_entries.filter(entry => {
      const saalik = usersData.find(u => u.id === entry.user_id);
      return saalik?.murabi_id === user?.id;
    });

    const avgCompletion = allEntries.length > 0 
      ? allEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / allEntries.length 
      : 0;

    setStats({
      totalSaaliks: assignedSaaliks.length,
      pendingReviews: pending.length,
      approvedToday: todayApproved,
      averageCompletion: Math.round(avgCompletion)
    });
  }, [user]);

  const handleReview = (entry, action) => {
    setSelectedEntry(entry);
    if (action === 'approve') {
      // Auto-approve without comment
      processReview(entry, 'approved', 'Approved by Murabi');
    } else {
      setReviewModalVisible(true);
    }
  };

  const processReview = (entry, status, reviewComment) => {
    // In a real app, this would make an API call
    console.log('Processing review:', { entry, status, comment: reviewComment });
    
    // Update local state
    setPendingReviews(prev => prev.filter(p => p.id !== entry.id));
    setStats(prev => ({
      ...prev,
      pendingReviews: prev.pendingReviews - 1,
      approvedToday: status === 'approved' ? prev.approvedToday + 1 : prev.approvedToday
    }));

    message.success(`Entry ${status} successfully`);
    setReviewModalVisible(false);
    setComment('');
    setSelectedEntry(null);
  };

  const getSaalikLevel = (saalikId) => {
    const saalik = usersData.find(u => u.id === saalikId);
    const level = levelsData.levels.find(l => l.level === saalik?.level);
    return level;
  };

  const getSaalikRecentProgress = (saalikId) => {
    const recentEntries = entriesData.daily_entries
      .filter(entry => entry.user_id === saalikId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
    
    return recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / recentEntries.length 
      : 0;
  };

  const pendingColumns = [
    {
      title: 'Saalik',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => {
        const saalik = usersData.find(u => u.id === userId);
        return (
          <Space>
            <Avatar size="small">{saalik?.name?.charAt(0)}</Avatar>
            <span>{saalik?.name}</span>
          </Space>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Completion',
      dataIndex: 'completion_percentage',
      key: 'completion_percentage',
      render: (percentage) => (
        <Progress 
          percent={percentage} 
          size="small" 
          strokeColor={percentage >= 80 ? colors.success : percentage >= 60 ? colors.warning : colors.danger}
        />
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
              setSelectedEntry(record);
              setReviewModalVisible(true);
            }}
          >
            Review
          </Button>
          <Button 
            size="small" 
            type="primary" 
            icon={<CheckOutlined />}
            onClick={() => handleReview(record, 'approve')}
          >
            Approve
          </Button>
          <Button 
            size="small" 
            danger 
            icon={<CloseOutlined />}
            onClick={() => handleReview(record, 'reject')}
          >
            Reject
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <DashboardHeader />
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="My Saaliks"
              value={stats.totalSaaliks}
              prefix={<TeamOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={stats.pendingReviews}
              prefix={<ClockCircleOutlined style={{ color: colors.warning }} />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Approved Today"
              value={stats.approvedToday}
              prefix={<CheckCircleOutlined style={{ color: colors.success }} />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Completion"
              value={stats.averageCompletion}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Pending Reviews */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Pending Reviews</span>
                <Badge count={stats.pendingReviews} />
              </Space>
            }
          >
            <Table
              dataSource={pendingReviews}
              columns={pendingColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>

        {/* My Saaliks Overview */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>My Saaliks</span>
              </Space>
            }
          >
            <List
              dataSource={mySaaliks}
              renderItem={(saalik) => {
                const level = getSaalikLevel(saalik.id);
                const progress = getSaalikRecentProgress(saalik.id);
                
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ 
                            backgroundColor: level?.color_code || colors.primary 
                          }}
                        >
                          {saalik.name?.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <span>{saalik.name}</span>
                          <Tag color={level?.color_code}>
                            Level {saalik.level}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {saalik.region} • {saalik.phone}
                          </Text>
                          <br />
                          <Progress 
                            percent={Math.round(progress)} 
                            size="small" 
                            showInfo={false}
                            strokeColor={progress >= 80 ? colors.success : colors.warning}
                          />
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            7-day avg: {Math.round(progress)}%
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Review Modal */}
      <Modal
        title="Review Entry"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setComment('');
          setSelectedEntry(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setReviewModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="reject" 
            danger 
            onClick={() => processReview(selectedEntry, 'rejected', comment)}
          >
            Reject
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={() => processReview(selectedEntry, 'approved', comment)}
          >
            Approve
          </Button>
        ]}
      >
        {selectedEntry && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Saalik: </Text>
                <Text>{usersData.find(u => u.id === selectedEntry.user_id)?.name}</Text>
              </div>
              <div>
                <Text strong>Date: </Text>
                <Text>{new Date(selectedEntry.date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text strong>Overall Completion: </Text>
                <Progress percent={selectedEntry.completion_percentage} size="small" />
              </div>
              
              <Tabs 
                defaultActiveKey="1" 
                size="small"
                items={[
                  {
                    key: "1",
                    label: "Categories",
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text>Prayers: {selectedEntry.categories?.farayz?.completed || 0}/5</Text>
                          <Progress 
                            percent={(selectedEntry.categories?.farayz?.completed || 0) / 5 * 100} 
                            size="small" 
                            showInfo={false}
                          />
                        </div>
                        <div>
                          <Text>Quran: {selectedEntry.categories?.quran_tilawat?.completed || 0}/4</Text>
                          <Progress 
                            percent={(selectedEntry.categories?.quran_tilawat?.completed || 0) / 4 * 100} 
                            size="small" 
                            showInfo={false}
                          />
                        </div>
                        <div>
                          <Text>Zikr: {selectedEntry.categories?.zikr?.completed || 0}/6</Text>
                          <Progress 
                            percent={(selectedEntry.categories?.zikr?.completed || 0) / 6 * 100} 
                            size="small" 
                            showInfo={false}
                          />
                        </div>
                      </Space>
                    )
                  },
                  {
                    key: "2",
                    label: "Times",
                    children: (
                      <Space direction="vertical">
                        <div>
                          <Text strong>Sleep Time: </Text>
                          <Text>{selectedEntry.sleep_wake?.sleep_time || 'Not recorded'}</Text>
                        </div>
                        <div>
                          <Text strong>Wake Time: </Text>
                          <Text>{selectedEntry.sleep_wake?.wake_time || 'Not recorded'}</Text>
                        </div>
                      </Space>
                    )
                  }
                ]}
              />

              <div>
                <Text strong>Comment:</Text>
                <TextArea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your feedback for the Saalik..."
                />
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MurabiDashboard;
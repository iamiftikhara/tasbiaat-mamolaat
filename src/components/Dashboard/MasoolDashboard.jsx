import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Typography, 
  Space, 
  Button,
  Progress,
  Select,
  DatePicker,
  Divider,
  Tag
} from 'antd';
import { 
  BarChartOutlined, 
  DownloadOutlined, 
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileExcelOutlined
} from '@ant-design/icons';

// Import dummy data
import usersData from '../../data/users.json';
import levelsData from '../../data/levels.json';
import entriesData from '../../data/entries.json';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const MasoolDashboard = ({ user, DashboardHeader, colors, isRTL, getCurrentFont, t }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeThisWeek: 0,
    averageCompletion: 0,
    topPerformer: null
  });

  useEffect(() => {
    loadWeeklyData();
  }, [selectedRegion, selectedLevel]);

  const loadWeeklyData = () => {
    // Filter users based on region and level
    let filteredUsers = usersData.filter(u => u.role === 'Saalik');
    
    if (selectedRegion !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.region === selectedRegion);
    }
    
    if (selectedLevel !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.level === parseInt(selectedLevel));
    }

    // Get this week's entries
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weeklyEntries = entriesData.daily_entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= thisWeek && 
             filteredUsers.some(u => u.id === entry.user_id);
    });

    // Calculate weekly summary for each user
    const userSummaries = filteredUsers.map(user => {
      const userEntries = weeklyEntries.filter(entry => entry.user_id === user.id);
      const avgCompletion = userEntries.length > 0 
        ? userEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / userEntries.length 
        : 0;
      
      const level = levelsData.levels.find(l => l.level === user.level);
      const murabi = usersData.find(u => u.id === user.murabi_id);

      return {
        key: user.id,
        name: user.name,
        region: user.region,
        level: user.level,
        levelName: level?.name_en || 'Unknown',
        murabi: murabi?.name || 'Unassigned',
        entriesCount: userEntries.length,
        avgCompletion: Math.round(avgCompletion),
        lastEntry: userEntries.length > 0 
          ? Math.max(...userEntries.map(e => new Date(e.date).getTime()))
          : null
      };
    });

    setWeeklyData(userSummaries);

    // Calculate stats
    const activeUsers = userSummaries.filter(u => u.entriesCount > 0);
    const totalCompletion = userSummaries.reduce((sum, u) => sum + u.avgCompletion, 0);
    const avgCompletion = userSummaries.length > 0 ? totalCompletion / userSummaries.length : 0;
    const topPerformer = userSummaries.reduce((top, current) => 
      current.avgCompletion > (top?.avgCompletion || 0) ? current : top, null
    );

    setStats({
      totalUsers: filteredUsers.length,
      activeThisWeek: activeUsers.length,
      averageCompletion: Math.round(avgCompletion),
      topPerformer
    });
  };

  const exportData = () => {
    // In a real app, this would generate and download an Excel file
    console.log('Exporting data:', weeklyData);
    // For demo purposes, just show a message
    alert('Export functionality would download Excel file with current data');
  };

  const getRegions = () => {
    const regions = [...new Set(usersData.filter(u => u.role === 'Saalik').map(u => u.region))];
    return regions;
  };

  const getLevels = () => {
    return levelsData.levels.map(l => ({ value: l.level, label: `Level ${l.level} - ${l.name_english}` }));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      filters: getRegions().map(region => ({ text: region, value: region })),
      onFilter: (value, record) => record.region === value
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level, record) => (
        <Tag color={levelsData.levels.find(l => l.level === level)?.color}>
          {level} - {record.levelName}
        </Tag>
      ),
      sorter: (a, b) => a.level - b.level
    },
    {
      title: 'Murabi',
      dataIndex: 'murabi',
      key: 'murabi'
    },
    {
      title: 'Entries This Week',
      dataIndex: 'entriesCount',
      key: 'entriesCount',
      render: (count) => (
        <Tag color={count >= 5 ? 'green' : count >= 3 ? 'orange' : 'red'}>
          {count}/7
        </Tag>
      ),
      sorter: (a, b) => a.entriesCount - b.entriesCount
    },
    {
      title: 'Avg Completion',
      dataIndex: 'avgCompletion',
      key: 'avgCompletion',
      render: (completion) => (
        <Progress 
          percent={completion} 
          size="small" 
          strokeColor={completion >= 80 ? colors.success : completion >= 60 ? colors.warning : colors.danger}
        />
      ),
      sorter: (a, b) => a.avgCompletion - b.avgCompletion
    },
    {
      title: 'Last Entry',
      dataIndex: 'lastEntry',
      key: 'lastEntry',
      render: (timestamp) => timestamp 
        ? new Date(timestamp).toLocaleDateString() 
        : 'No entries',
      sorter: (a, b) => (a.lastEntry || 0) - (b.lastEntry || 0)
    }
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <DashboardHeader />
      
      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Text strong>Region:</Text>
              <Select
                value={selectedRegion}
                onChange={setSelectedRegion}
                style={{ width: '100%' }}
              >
                <Option value="all">All Regions</Option>
                {getRegions().map(region => (
                  <Option key={region} value={region}>{region}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Text strong>Level:</Text>
              <Select
                value={selectedLevel}
                onChange={setSelectedLevel}
                style={{ width: '100%' }}
              >
                <Option value="all">All Levels</Option>
                {getLevels().map(level => (
                  <Option key={level.value} value={level.value.toString()}>
                    {level.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Text strong>Date Range:</Text>
              <RangePicker style={{ width: '100%' }} />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={exportData}
              style={{ width: '100%' }}
            >
              Export Data
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Saaliks"
              value={stats.totalUsers}
              prefix={<TeamOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active This Week"
              value={stats.activeThisWeek}
              suffix={`/ ${stats.totalUsers}`}
              prefix={<CalendarOutlined style={{ color: colors.success }} />}
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
              prefix={<BarChartOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Top Performer"
              value={stats.topPerformer?.name || 'N/A'}
              prefix={<TrophyOutlined style={{ color: colors.warning }} />}
              valueStyle={{ color: colors.warning, fontSize: 16 }}
            />
            {stats.topPerformer && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {stats.topPerformer.avgCompletion}% completion
              </Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Weekly Report Table */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            <span>Weekly Performance Report</span>
          </Space>
        }
        extra={
          <Button 
            icon={<FileExcelOutlined />}
            onClick={exportData}
          >
            Export to Excel
          </Button>
        }
      >
        <Table
          dataSource={weeklyData}
          columns={columns}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} Saaliks`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default MasoolDashboard;
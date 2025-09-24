import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Space, 
  Progress,
  Select,
  DatePicker,
  Tabs,
  List,
  Avatar,
  Tag
} from 'antd';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  GlobalOutlined,
  TrophyOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';

// Import dummy data
import usersData from '../../data/users.json';
import levelsData from '../../data/levels.json';
import entriesData from '../../data/entries.json';

const { Title, Text } = Typography;
const { Option } = Select;

const SheikhDashboard = ({ user, DashboardHeader, colors, isRTL, getCurrentFont, t }) => {
  const [monthlyStats, setMonthlyStats] = useState({});
  const [regionalData, setRegionalData] = useState([]);
  const [levelDistribution, setLevelDistribution] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    loadMonthlyData();
  }, [selectedMonth]);

  const loadMonthlyData = () => {
    // Get current month's data
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), selectedMonth, 1);
    const monthEnd = new Date(currentDate.getFullYear(), selectedMonth + 1, 0);

    const monthlyEntries = entriesData.daily_entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });

    // Calculate regional performance
    const regions = [...new Set(usersData.filter(u => u.role === 'Saalik').map(u => u.region))];
    const regionalPerformance = regions.map(region => {
      const regionUsers = usersData.filter(u => u.role === 'Saalik' && u.region === region);
      const regionEntries = monthlyEntries.filter(entry => 
        regionUsers.some(u => u.id === entry.user_id)
      );
      
      const avgCompletion = regionEntries.length > 0 
        ? regionEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / regionEntries.length 
        : 0;

      const activeUsers = regionUsers.filter(user => 
        regionEntries.some(entry => entry.user_id === user.id)
      ).length;

      return {
        region,
        totalUsers: regionUsers.length,
        activeUsers,
        avgCompletion: Math.round(avgCompletion),
        totalEntries: regionEntries.length,
        trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend data
      };
    });

    setRegionalData(regionalPerformance);

    // Calculate level distribution
    const levelStats = levelsData.levels.map(level => {
      const levelUsers = usersData.filter(u => u.role === 'Saalik' && u.level === level.level);
      const levelEntries = monthlyEntries.filter(entry => 
        levelUsers.some(u => u.id === entry.user_id)
      );
      
      const avgCompletion = levelEntries.length > 0 
        ? levelEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / levelEntries.length 
        : 0;

      return {
        level: level.level,
        name: level.name_en,
        nameUr: level.name_ur,
        color: level.color_code,
        userCount: levelUsers.length,
        avgCompletion: Math.round(avgCompletion),
        totalEntries: levelEntries.length
      };
    });

    setLevelDistribution(levelStats);

    // Calculate top performers
    const userPerformance = usersData
      .filter(u => u.role === 'Saalik')
      .map(user => {
        const userEntries = monthlyEntries.filter(entry => entry.user_id === user.id);
        const avgCompletion = userEntries.length > 0 
          ? userEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / userEntries.length 
          : 0;
        
        const level = levelsData.levels.find(l => l.level === user.level);
        const murabi = usersData.find(u => u.id === user.murabi_id);

        return {
          ...user,
          avgCompletion: Math.round(avgCompletion),
          entriesCount: userEntries.length,
          levelName: level?.name_en,
          levelColor: level?.color_code,
          murabiName: murabi?.name
        };
      })
      .sort((a, b) => b.avgCompletion - a.avgCompletion)
      .slice(0, 10);

    setTopPerformers(userPerformance);

    // Calculate overall monthly stats
    const totalUsers = usersData.filter(u => u.role === 'Saalik').length;
    const activeUsers = [...new Set(monthlyEntries.map(entry => entry.user_id))].length;
    const totalEntries = monthlyEntries.length;
    const avgCompletion = monthlyEntries.length > 0 
      ? monthlyEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / monthlyEntries.length 
      : 0;

    setMonthlyStats({
      totalUsers,
      activeUsers,
      totalEntries,
      avgCompletion: Math.round(avgCompletion),
      participationRate: Math.round((activeUsers / totalUsers) * 100)
    });
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <DashboardHeader />
      
      {/* Month Selector */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Text strong>Select Month:</Text>
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: '100%' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i} value={i}>{getMonthName(i)}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Title level={4} style={{ margin: 0 }}>
              Monthly Analytics - {getMonthName(selectedMonth)} {new Date().getFullYear()}
            </Title>
          </Col>
        </Row>
      </Card>

      {/* Overall Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Saaliks"
              value={monthlyStats.totalUsers}
              prefix={<TeamOutlined style={{ color: colors.primary }} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active This Month"
              value={monthlyStats.activeUsers}
              suffix={`(${monthlyStats.participationRate}%)`}
              prefix={<GlobalOutlined style={{ color: colors.success }} />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Entries"
              value={monthlyStats.totalEntries}
              prefix={<BarChartOutlined style={{ color: colors.accent }} />}
              valueStyle={{ color: colors.accent }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Completion"
              value={monthlyStats.avgCompletion}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: colors.warning }} />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Regional Performance",
            children: (
              <Row gutter={[16, 16]}>
                {regionalData.map(region => (
                  <Col xs={24} sm={12} lg={8} key={region.region}>
                    <Card 
                      title={
                        <Space>
                          <GlobalOutlined />
                          <span>{region.region}</span>
                          {region.trend === 'up' ? 
                            <RiseOutlined style={{ color: colors.success }} /> : 
                            <FallOutlined style={{ color: colors.danger }} />
                          }
                        </Space>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>Active Users: </Text>
                          <Text>{region.activeUsers}/{region.totalUsers}</Text>
                          <Progress 
                            percent={Math.round((region.activeUsers / region.totalUsers) * 100)} 
                            size="small" 
                            showInfo={false}
                          />
                        </div>
                        <div>
                          <Text strong>Avg Completion: </Text>
                          <Text>{region.avgCompletion}%</Text>
                          <Progress 
                            percent={region.avgCompletion} 
                            size="small" 
                            strokeColor={region.avgCompletion >= 80 ? colors.success : colors.warning}
                            showInfo={false}
                          />
                        </div>
                        <div>
                          <Text strong>Total Entries: </Text>
                          <Text>{region.totalEntries}</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          },
          {
            key: "2",
            label: "Level Distribution",
            children: (
              <Row gutter={[16, 16]}>
                {levelDistribution.map(level => (
                  <Col xs={24} sm={12} lg={8} key={level.level}>
                    <Card 
                      title={
                        <Space>
                          <Avatar 
                            size="small" 
                            style={{ backgroundColor: level.color }}
                          >
                            {level.level}
                          </Avatar>
                          <span>{level.name}</span>
                        </Space>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic
                          title="Total Users"
                          value={level.userCount}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: colors.primary }}
                        />
                        <Progress 
                          percent={level.completionRate} 
                          strokeColor={level.color}
                        />
                        <Text type="secondary">
                          Avg Score: {level.avgScore}%
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          },
          {
            key: "3",
            label: "Top Performers",
            children: (
              <Card>
                <List
                  dataSource={topPerformers}
                  renderItem={(performer, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Space>
                            <Text strong style={{ color: colors.primary }}>
                              #{index + 1}
                            </Text>
                            <Avatar 
                              style={{ 
                                backgroundColor: performer.levelColor,
                                color: 'white'
                              }}
                            >
                              {performer.name?.charAt(0)}
                            </Avatar>
                          </Space>
                        }
                        title={
                          <Space>
                            <span>{performer.name}</span>
                            <Tag color={performer.levelColor}>
                              Level {performer.level}
                            </Tag>
                            {index < 3 && <TrophyOutlined style={{ color: colors.warning }} />}
                          </Space>
                        }
                        description={
                          <Space>
                            <Text type="secondary">
                              {performer.region} • Murabi: {performer.murabiName}
                            </Text>
                            <Text type="secondary">
                              {performer.entriesCount} entries
                            </Text>
                          </Space>
                        }
                      />
                      <div>
                        <Progress 
                          percent={performer.avgCompletion} 
                          size="small" 
                          strokeColor={performer.avgCompletion >= 90 ? colors.success : colors.warning}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default SheikhDashboard;
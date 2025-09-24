'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Table, Select, DatePicker, Space, Statistic, Progress } from 'antd';
import { DownloadOutlined, BarChartOutlined, PieChartOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function MasoolDashboard() {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const theme = useTheme();

  // Mock data for weekly summaries
  const weeklyData = [
    {
      week: 'Week 1 (Jan 1-7)',
      totalSaaliks: 45,
      activeSubmissions: 38,
      avgCompletion: 82,
      topPerformers: 12,
      needsAttention: 5
    },
    {
      week: 'Week 2 (Jan 8-14)',
      totalSaaliks: 47,
      activeSubmissions: 42,
      avgCompletion: 85,
      topPerformers: 15,
      needsAttention: 3
    },
    {
      week: 'Week 3 (Jan 15-21)',
      totalSaaliks: 48,
      activeSubmissions: 45,
      avgCompletion: 88,
      topPerformers: 18,
      needsAttention: 2
    }
  ];

  const categoryPerformance = [
    { category: 'Farayz (فرائض)', completion: 92, trend: '+5%' },
    { category: 'Quran Tilawat (قرآن تلاوت)', completion: 78, trend: '+2%' },
    { category: 'Zikr (ذکر)', completion: 85, trend: '+8%' },
    { category: 'Nawafil (نوافل)', completion: 65, trend: '-3%' },
    { category: 'Hifazat (حفاظت)', completion: 71, trend: '+1%' }
  ];

  const regionData = [
    { region: 'Karachi', saaliks: 15, avgCompletion: 87 },
    { region: 'Lahore', saaliks: 12, avgCompletion: 82 },
    { region: 'Islamabad', saaliks: 8, avgCompletion: 90 },
    { region: 'Faisalabad', saaliks: 6, avgCompletion: 79 },
    { region: 'Multan', saaliks: 7, avgCompletion: 85 }
  ];

  const columns = [
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week'
    },
    {
      title: 'Total Saaliks',
      dataIndex: 'totalSaaliks',
      key: 'totalSaaliks',
      render: (value) => <Text strong>{value}</Text>
    },
    {
      title: 'Active Submissions',
      dataIndex: 'activeSubmissions',
      key: 'activeSubmissions',
      render: (value, record) => (
        <div>
          <Text>{value}</Text>
          <div style={{ fontSize: '12px', color: theme.getColor('neutral', 500) }}>
            {Math.round((value / record.totalSaaliks) * 100)}% participation
          </div>
        </div>
      )
    },
    {
      title: 'Avg Completion',
      dataIndex: 'avgCompletion',
      key: 'avgCompletion',
      render: (value) => (
        <div>
          <Text>{value}%</Text>
          <Progress 
            percent={value} 
            size="small" 
            showInfo={false}
            strokeColor={value >= 80 ? theme.getColor('success', 500) : 
                       value >= 60 ? theme.getColor('warning', 500) : 
                       theme.getColor('danger', 500)}
          />
        </div>
      )
    },
    {
      title: 'Top Performers',
      dataIndex: 'topPerformers',
      key: 'topPerformers',
      render: (value) => <Text style={{ color: theme.getColor('success', 600) }}>{value}</Text>
    },
    {
      title: 'Needs Attention',
      dataIndex: 'needsAttention',
      key: 'needsAttention',
      render: (value) => <Text style={{ color: theme.getColor('danger', 600) }}>{value}</Text>
    }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting weekly report...');
    // In real implementation, this would generate and download a report
  };

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
            Masool Dashboard
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
            Weekly Aggregated Summaries & Reports
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
                <Text strong>Select Week Range</Text>
                <RangePicker 
                  style={{ width: '100%' }}
                  onChange={setSelectedWeek}
                />
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Region</Text>
                <Select
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All Regions</Option>
                  <Option value="karachi">Karachi</Option>
                  <Option value="lahore">Lahore</Option>
                  <Option value="islamabad">Islamabad</Option>
                  <Option value="faisalabad">Faisalabad</Option>
                  <Option value="multan">Multan</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={10}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleExportReport}
                >
                  Export Weekly Report
                </Button>
                <Button icon={<BarChartOutlined />}>
                  View Charts
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Summary Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Total Saaliks"
                value={48}
                prefix={<TeamOutlined />}
                valueStyle={{ color: theme.getColor('primary', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Weekly Avg Completion"
                value={88}
                suffix="%"
                valueStyle={{ color: theme.getColor('success', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Active This Week"
                value={45}
                valueStyle={{ color: theme.getColor('secondary', 600) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ borderRadius: theme.getRadius('xl'), textAlign: 'center' }}>
              <Statistic
                title="Need Attention"
                value={2}
                valueStyle={{ color: theme.getColor('warning', 600) }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Weekly Summary Table */}
          <Col xs={24} lg={16}>
            <Card 
              title="Weekly Performance Summary"
              style={{
                borderRadius: theme.getRadius('xl'),
                boxShadow: theme.getShadow('card')
              }}
            >
              <Table
                columns={columns}
                dataSource={weeklyData}
                rowKey="week"
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>

          {/* Category Performance */}
          <Col xs={24} lg={8}>
            <Card 
              title="Category Performance"
              style={{
                borderRadius: theme.getRadius('xl'),
                boxShadow: theme.getShadow('card')
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {categoryPerformance.map((item, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text style={{ fontSize: '12px' }}>{item.category}</Text>
                      <Text style={{ fontSize: '12px', color: item.trend.startsWith('+') ? theme.getColor('success', 600) : theme.getColor('danger', 600) }}>
                        {item.trend}
                      </Text>
                    </div>
                    <Progress 
                      percent={item.completion} 
                      size="small"
                      strokeColor={item.completion >= 80 ? theme.getColor('success', 500) : 
                                 item.completion >= 60 ? theme.getColor('warning', 500) : 
                                 theme.getColor('danger', 500)}
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Regional Performance */}
        <Card 
          title="Regional Performance"
          style={{
            borderRadius: theme.getRadius('xl'),
            boxShadow: theme.getShadow('card'),
            marginTop: '24px'
          }}
        >
          <Row gutter={[16, 16]}>
            {regionData.map((region, index) => (
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Card 
                  size="small"
                  style={{ 
                    textAlign: 'center',
                    borderRadius: theme.getRadius('lg')
                  }}
                >
                  <Title level={4} style={{ margin: '0 0 8px 0' }}>{region.region}</Title>
                  <Text type="secondary">{region.saaliks} Saaliks</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Progress 
                      type="circle" 
                      percent={region.avgCompletion} 
                      size={60}
                      strokeColor={region.avgCompletion >= 85 ? theme.getColor('success', 500) : 
                                 region.avgCompletion >= 70 ? theme.getColor('warning', 500) : 
                                 theme.getColor('danger', 500)}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  );
}
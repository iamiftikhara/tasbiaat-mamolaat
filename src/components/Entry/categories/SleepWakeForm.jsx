'use client';

import React from 'react';
import { Form, TimePicker, Row, Col, Typography, Space, Card, Statistic } from 'antd';
import { ClockCircleOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const SleepWakeForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  // Watch form values to calculate sleep duration
  const sleepTime = Form.useWatch(['sleep_wake', 'sleep_time'], form);
  const wakeTime = Form.useWatch(['sleep_wake', 'wake_time'], form);

  const calculateSleepDuration = () => {
    if (!sleepTime || !wakeTime) return null;
    
    const sleep = dayjs(sleepTime, 'HH:mm');
    let wake = dayjs(wakeTime, 'HH:mm');
    
    // If wake time is earlier than sleep time, it means next day
    if (wake.isBefore(sleep)) {
      wake = wake.add(1, 'day');
    }
    
    const duration = wake.diff(sleep, 'hour', true);
    return duration.toFixed(1);
  };

  const getSleepQuality = (hours) => {
    if (!hours) return null;
    if (hours >= 7 && hours <= 9) return { text: 'Excellent', color: '#52c41a' };
    if (hours >= 6 && hours < 7) return { text: 'Good', color: '#faad14' };
    if (hours >= 5 && hours < 6) return { text: 'Fair', color: '#fa8c16' };
    return { text: 'Poor', color: '#f5222d' };
  };

  const sleepDuration = calculateSleepDuration();
  const sleepQuality = getSleepQuality(sleepDuration);

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.sleep_wake.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Track your sleep and wake times for better spiritual discipline
          </Text>
        </div>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <Card 
              size="small"
              title={
                <Space>
                  <MoonOutlined style={{ color: '#722ed1' }} />
                  <span style={{ fontFamily: getCurrentFont('primary') }}>
                    {t('categories.sleep_wake.sleep_time')}
                  </span>
                </Space>
              }
              headStyle={{ fontFamily: getCurrentFont('primary') }}
            >
              <Form.Item
                name={['sleep_wake', 'sleep_time']}
                rules={[
                  { required: true, message: 'Please select sleep time' }
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="Select sleep time"
                  style={{ width: '100%', fontFamily: getCurrentFont('secondary') }}
                  size="large"
                />
              </Form.Item>
              
              <Text 
                type="secondary" 
                style={{ 
                  fontFamily: getCurrentFont('secondary'),
                  fontSize: '12px'
                }}
              >
                Recommended: Before 11:00 PM
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card 
              size="small"
              title={
                <Space>
                  <SunOutlined style={{ color: '#faad14' }} />
                  <span style={{ fontFamily: getCurrentFont('primary') }}>
                    {t('categories.sleep_wake.wake_time')}
                  </span>
                </Space>
              }
              headStyle={{ fontFamily: getCurrentFont('primary') }}
            >
              <Form.Item
                name={['sleep_wake', 'wake_time']}
                rules={[
                  { required: true, message: 'Please select wake time' }
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="Select wake time"
                  style={{ width: '100%', fontFamily: getCurrentFont('secondary') }}
                  size="large"
                />
              </Form.Item>
              
              <Text 
                type="secondary" 
                style={{ 
                  fontFamily: getCurrentFont('secondary'),
                  fontSize: '12px'
                }}
              >
                Recommended: Before Fajr time
              </Text>
            </Card>
          </Col>
        </Row>

        {sleepDuration && (
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontFamily: getCurrentFont('primary') }}>Sleep Analysis</span>
              </Space>
            }
            headStyle={{ fontFamily: getCurrentFont('primary') }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Sleep Duration"
                  value={sleepDuration}
                  suffix="hours"
                  valueStyle={{ 
                    fontFamily: getCurrentFont('primary'),
                    color: sleepQuality?.color 
                  }}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Sleep Quality"
                  value={sleepQuality?.text}
                  valueStyle={{ 
                    fontFamily: getCurrentFont('primary'),
                    color: sleepQuality?.color 
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                  <Text 
                    style={{ 
                      fontFamily: getCurrentFont('secondary'),
                      fontSize: '12px',
                      color: '#666'
                    }}
                  >
                    Optimal: 7-9 hours
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <div style={{ 
          background: '#f0f5ff', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #adc6ff'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#1d39c4'
          }}>
            🌙 Sunnah: Sleep early and wake up before Fajr for Tahajjud prayer. This schedule aligns with natural circadian rhythms and spiritual practices.
          </Text>
        </div>

        <div style={{ 
          background: '#fff7e6', 
          padding: '12px', 
          borderRadius: '6px',
          border: '1px solid #ffd591'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '13px',
            color: '#d46b08'
          }}>
            💡 Tip: Consistent sleep schedule helps in maintaining regular prayer times and overall spiritual discipline.
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default SleepWakeForm;
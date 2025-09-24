'use client';

import React from 'react';
import { Form, Checkbox, Row, Col, Typography, Space, Card } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const ZikrForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  const zikrItems = [
    '100 استغفار',
    '100 درود شریف',
    '100 تیسرا کلمہ',
    '100 پہلا کلمہ'
  ];

  const ZikrSection = ({ timeKey, title, icon }) => (
    <Card 
      size="small" 
      title={
        <Space>
          {icon}
          <span style={{ fontFamily: getCurrentFont('primary') }}>{title}</span>
        </Space>
      }
      style={{ marginBottom: '16px' }}
      headStyle={{ fontFamily: getCurrentFont('primary') }}
    >
      <Row gutter={[16, 8]}>
        {zikrItems.map((item) => (
          <Col xs={24} sm={12} key={item}>
            <Form.Item
              name={['zikr', timeKey, item]}
              valuePropName="checked"
              style={{ marginBottom: '8px' }}
            >
              <Checkbox style={{ fontFamily: getCurrentFont('primary') }}>
                {t(`categories.zikr.items.${item}`) || item}
              </Checkbox>
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Card>
  );

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.zikr.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Track your daily remembrance (Zikr) practices
          </Text>
        </div>

        <ZikrSection 
          timeKey="morning"
          title={t('categories.zikr.morning')}
          icon={<SunOutlined style={{ color: '#faad14' }} />}
        />

        <ZikrSection 
          timeKey="evening"
          title={t('categories.zikr.evening')}
          icon={<MoonOutlined style={{ color: '#722ed1' }} />}
        />

        <div style={{ 
          background: '#f6ffed', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #b7eb8f'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#389e0d'
          }}>
            🤲 Tip: Consistent Zikr purifies the heart and brings you closer to Allah.
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default ZikrForm;
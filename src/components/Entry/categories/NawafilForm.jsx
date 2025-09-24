'use client';

import React from 'react';
import { Form, Checkbox, Row, Col, Typography, Space } from 'antd';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const NawafilForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  const nawafilItems = [
    'تہجد',
    'اشراق',
    'چاشت',
    'اوابین',
    'جمعہ کو صلاة التسبیح'
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.nawafil.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Mark the voluntary prayers you performed today
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {nawafilItems.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={item}>
              <Form.Item
                name={['nawafil', item]}
                valuePropName="checked"
                style={{ marginBottom: '8px' }}
              >
                <Checkbox style={{ fontFamily: getCurrentFont('primary') }}>
                  {t(`categories.nawafil.items.${item}`) || item}
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div style={{ 
          background: '#fff7e6', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #ffd591'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#d46b08'
          }}>
            🌟 Remember: Voluntary prayers are a means of drawing closer to Allah and earning extra rewards.
          </Text>
        </div>

        <div style={{ 
          background: '#f0f5ff', 
          padding: '12px', 
          borderRadius: '6px',
          border: '1px solid #adc6ff'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '13px',
            color: '#1d39c4'
          }}>
            ℹ️ Tahajjud: Night prayer before Fajr | Ishraq: After sunrise | Chasht: Mid-morning | Awabeen: After Maghrib
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default NawafilForm;
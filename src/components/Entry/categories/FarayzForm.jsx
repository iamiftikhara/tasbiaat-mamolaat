'use client';

import React from 'react';
import { Form, Checkbox, Row, Col, Typography, Space } from 'antd';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const FarayzForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  const farayzItems = [
    'فجر باجماعت',
    'ظہر باجماعت', 
    'عصر باجماعت',
    'مغرب باجماعت',
    'عشاء باجماعت'
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.farayz.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Mark the prayers you performed in congregation
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {farayzItems.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={item}>
              <Form.Item
                name={['farayz', item]}
                valuePropName="checked"
                style={{ marginBottom: '8px' }}
              >
                <Checkbox style={{ fontFamily: getCurrentFont('primary') }}>
                  {t(`categories.farayz.items.${item}`) || item}
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div style={{ 
          background: '#f6f8fa', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#666'
          }}>
            💡 Tip: Try to perform all five daily prayers in congregation for maximum spiritual benefit.
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default FarayzForm;
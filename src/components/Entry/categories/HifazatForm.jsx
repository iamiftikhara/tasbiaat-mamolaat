'use client';

import React from 'react';
import { Form, Checkbox, Row, Col, Typography, Space } from 'antd';
import { EyeOutlined, SoundOutlined, MessageOutlined } from '@ant-design/icons';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const HifazatForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  const hifazatItems = [
    {
      key: 'نظر کی حفاظت',
      icon: <EyeOutlined style={{ color: '#1890ff' }} />,
      description: 'Guarding your gaze from inappropriate content'
    },
    {
      key: 'زبان کی حفاظت',
      icon: <MessageOutlined style={{ color: '#52c41a' }} />,
      description: 'Protecting your tongue from harmful speech'
    },
    {
      key: 'کان کی حفاظت',
      icon: <SoundOutlined style={{ color: '#faad14' }} />,
      description: 'Guarding your ears from inappropriate content'
    }
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.hifazat.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Track your efforts in protecting yourself from spiritual harm
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {hifazatItems.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.key}>
              <div style={{
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                padding: '16px',
                height: '100%',
                transition: 'all 0.3s ease'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    {item.icon}
                    <Text strong style={{ fontFamily: getCurrentFont('primary') }}>
                      {t(`categories.hifazat.items.${item.key}`) || item.key}
                    </Text>
                  </Space>
                  
                  <Text 
                    type="secondary" 
                    style={{ 
                      fontFamily: getCurrentFont('secondary'),
                      fontSize: '12px',
                      display: 'block'
                    }}
                  >
                    {item.description}
                  </Text>
                  
                  <Form.Item
                    name={['hifazat', item.key]}
                    valuePropName="checked"
                    style={{ marginBottom: 0, marginTop: '8px' }}
                  >
                    <Checkbox style={{ fontFamily: getCurrentFont('primary') }}>
                      Successfully maintained today
                    </Checkbox>
                  </Form.Item>
                </Space>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ 
          background: '#fff2f0', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #ffccc7'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#cf1322'
          }}>
            🛡️ Important: Protecting your senses is crucial for spiritual purification and maintaining a clean heart.
          </Text>
        </div>

        <div style={{ 
          background: '#f6ffed', 
          padding: '12px', 
          borderRadius: '6px',
          border: '1px solid #b7eb8f'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '13px',
            color: '#389e0d'
          }}>
            💡 Tip: If you struggled with any area today, make du'a for strength and try again tomorrow.
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default HifazatForm;
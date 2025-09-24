'use client';

import React from 'react';
import { Form, Checkbox, Row, Col, Typography, Space } from 'antd';
import { useMultilingual } from '../../../hooks/useMultilingual';

const { Title, Text } = Typography;

const QuranTilawatForm = ({ form }) => {
  const { t, getCurrentFont } = useMultilingual();

  const tilawatItems = [
    'سورہ یاسین',
    'سورہ واقعہ',
    'سورہ ملک',
    'ادھا پارہ تلاوت'
  ];

  return (
    <div style={{ fontFamily: getCurrentFont('primary') }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '16px' }}>
            {t('categories.quran_tilawat.title')}
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Mark the Quranic recitations you completed today
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {tilawatItems.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={item}>
              <Form.Item
                name={['quran_tilawat', item]}
                valuePropName="checked"
                style={{ marginBottom: '8px' }}
              >
                <Checkbox style={{ fontFamily: getCurrentFont('primary') }}>
                  {t(`categories.quran_tilawat.items.${item}`) || item}
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div style={{ 
          background: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <Text style={{ 
            fontFamily: getCurrentFont('secondary'),
            fontSize: '14px',
            color: '#0369a1'
          }}>
            📖 Remember: Regular Quran recitation brings peace to the heart and mind.
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default QuranTilawatForm;
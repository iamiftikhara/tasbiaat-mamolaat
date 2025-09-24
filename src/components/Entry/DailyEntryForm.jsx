'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Steps, message, Row, Col, Typography, Space, Divider } from 'antd';
import { SaveOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMultilingual } from '../../hooks/useMultilingual';
import { useAuth } from '../../contexts/AuthContext';

// Import category components
import FarayzForm from './categories/FarayzForm';
import QuranTilawatForm from './categories/QuranTilawatForm';
import ZikrForm from './categories/ZikrForm';
import NawafilForm from './categories/NawafilForm';
import HifazatForm from './categories/HifazatForm';
import SleepWakeForm from './categories/SleepWakeForm';

// Import dummy data
import entriesData from '../../data/entries.json';

const { Title, Text } = Typography;
const { Step } = Steps;

const DailyEntryForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  const { t, getCurrentFont } = useMultilingual();
  const { user } = useAuth();

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Check if entry exists for today
  const existingEntry = entriesData.entries.find(
    entry => entry.user_id === user?.id && entry.date === today
  );

  const steps = [
    {
      title: t('categories.farayz.title'),
      key: 'farayz',
      component: FarayzForm
    },
    {
      title: t('categories.quran_tilawat.title'),
      key: 'quran_tilawat',
      component: QuranTilawatForm
    },
    {
      title: t('categories.zikr.title'),
      key: 'zikr',
      component: ZikrForm
    },
    {
      title: t('categories.nawafil.title'),
      key: 'nawafil',
      component: NawafilForm
    },
    {
      title: t('categories.hifazat.title'),
      key: 'hifazat',
      component: HifazatForm
    },
    {
      title: t('categories.sleep_wake.title'),
      key: 'sleep_wake',
      component: SleepWakeForm
    }
  ];

  useEffect(() => {
    // Load existing entry data if available
    if (existingEntry) {
      setFormData(existingEntry.categories);
      form.setFieldsValue(existingEntry.categories);
      calculateCompletion(existingEntry.categories);
    }
  }, [existingEntry, form]);

  const calculateCompletion = (data) => {
    let totalItems = 0;
    let completedItems = 0;

    // Count farayz items
    if (data.farayz) {
      Object.values(data.farayz).forEach(value => {
        totalItems++;
        if (value) completedItems++;
      });
    }

    // Count quran_tilawat items
    if (data.quran_tilawat) {
      Object.values(data.quran_tilawat).forEach(value => {
        totalItems++;
        if (value) completedItems++;
      });
    }

    // Count zikr items
    if (data.zikr) {
      ['morning', 'evening'].forEach(time => {
        if (data.zikr[time]) {
          Object.values(data.zikr[time]).forEach(value => {
            totalItems++;
            if (value) completedItems++;
          });
        }
      });
    }

    // Count nawafil items
    if (data.nawafil) {
      Object.values(data.nawafil).forEach(value => {
        totalItems++;
        if (value) completedItems++;
      });
    }

    // Count hifazat items
    if (data.hifazat) {
      Object.values(data.hifazat).forEach(value => {
        totalItems++;
        if (value) completedItems++;
      });
    }

    // Count sleep_wake (if both times are set)
    if (data.sleep_wake && data.sleep_wake.sleep_time && data.sleep_wake.wake_time) {
      totalItems += 2;
      if (data.sleep_wake.sleep_time) completedItems++;
      if (data.sleep_wake.wake_time) completedItems++;
    }

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    setCompletionPercentage(percentage);
  };

  const handleFormChange = (changedValues, allValues) => {
    const updatedData = { ...formData, ...allValues };
    setFormData(updatedData);
    calculateCompletion(updatedData);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Here you would normally save to backend
      // For now, we'll just show a success message
      message.success(t('messages.success'));
      
      // Update local data simulation
      console.log('Saving entry data:', {
        user_id: user?.id,
        date: today,
        categories: values,
        completion_percentage: completionPercentage
      });
      
    } catch (error) {
      message.error(t('messages.error'));
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Here you would normally submit to backend
      message.success('Entry submitted successfully!');
      
      console.log('Submitting entry data:', {
        user_id: user?.id,
        date: today,
        categories: values,
        completion_percentage: completionPercentage,
        status: 'submitted'
      });
      
    } catch (error) {
      message.error(t('messages.error'));
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFormData({});
    setCompletionPercentage(0);
    setCurrentStep(0);
    message.info('Form reset successfully');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div style={{ padding: '24px', fontFamily: getCurrentFont('primary') }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ fontFamily: getCurrentFont('primary'), marginBottom: '8px' }}>
            Daily Entry Form
          </Title>
          <Text type="secondary" style={{ fontFamily: getCurrentFont('secondary') }}>
            Date: {today} | Completion: {completionPercentage}%
          </Text>
        </div>

        <Steps 
          current={currentStep} 
          size="small"
          style={{ marginBottom: '32px' }}
        >
          {steps.map((step, index) => (
            <Step 
              key={step.key} 
              title={step.title}
              style={{ fontFamily: getCurrentFont('secondary') }}
            />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          style={{ fontFamily: getCurrentFont('primary') }}
        >
          <Card 
            title={steps[currentStep].title}
            style={{ marginBottom: '24px' }}
            headStyle={{ fontFamily: getCurrentFont('primary') }}
          >
            <CurrentStepComponent form={form} />
          </Card>

          <Divider />

          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  style={{ fontFamily: getCurrentFont('secondary') }}
                >
                  Previous
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  style={{ fontFamily: getCurrentFont('secondary') }}
                >
                  Next
                </Button>
              </Space>
            </Col>
            
            <Col>
              <Space>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  style={{ fontFamily: getCurrentFont('secondary') }}
                >
                  Reset
                </Button>
                <Button 
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={loading}
                  style={{ fontFamily: getCurrentFont('secondary') }}
                >
                  {t('actions.save')}
                </Button>
                <Button 
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ fontFamily: getCurrentFont('secondary') }}
                >
                  {t('actions.submit')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default DailyEntryForm;
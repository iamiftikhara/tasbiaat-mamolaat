'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from '@/components/RoleGuard';
import SaalikForm from '@/components/SaalikForm';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Alert, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Divider,
  Progress,
  Statistic,
  message
} from 'antd';
import {
  BookOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalculatorOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SaalikEntryPage = () => {
  const { user, apiCall } = useAuth();
  const [level, setLevel] = useState(1);
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user level
        const levelData = await apiCall('/api/saalik/level');
        setLevel(levelData.level);
        
        // Check if today's entry already exists
        const todayData = await apiCall('/api/saalik/today-entry');
        setTodayEntry(todayData.entry);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, apiCall]);

  const [form] = Form.useForm();

  const handleFormSubmit = async (formData) => {
    try {
      const result = await apiCall('/api/saalik/submit-entry', {
        date: new Date().toISOString().split('T')[0],
        level: level,
        data: formData
      });
      
      if (result.success) {
        message.success('Entry saved successfully! - اندراج کامیابی سے محفوظ ہو گیا!');
        form.resetFields();
        // Redirect to dashboard after successful submission
        setTimeout(() => {
          router.push('/dashboard/saalik');
        }, 1500);
        return { success: true };
      } else {
        message.error(result.error || 'Failed to save entry - اندراج محفوظ کرنے میں ناکامی');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      const errorMsg = 'Network error occurred - نیٹ ورک کی خرابی ہوئی';
      message.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['saalik']}>
      <div className={`${language === 'ur' ? 'rtl font-urdu' : 'ltr'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">{t.title}</h1>
              <p className="text-slate-600 text-lg">{t.subtitle}</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  {new Date().toLocaleDateString()}
                </p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {t.level}: {userLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="card shadow-modern overflow-hidden">
          <div className="card-header gradient-header">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">📝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t.dailyEntry}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {t.formDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <p className="text-slate-600 text-lg">Loading your form...</p>
              </div>
            ) : (
              <SaalikForm
                userLevel={userLevel}
                language={language}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                existingEntry={existingEntry}
              />
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mt-6 p-6 rounded-xl border-l-4 ${
            message.includes('success') || message.includes('کامیاب')
              ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
              : 'bg-red-50 text-red-800 border-red-400'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  message.includes('success') || message.includes('کامیاب')
                    ? 'bg-emerald-100'
                    : 'bg-red-100'
                }`}>
                  {message.includes('success') || message.includes('کامیاب') ? (
                    <span className="text-emerald-600 text-xl">✓</span>
                  ) : (
                    <span className="text-red-600 text-xl">✗</span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => router.push('/dashboard/saalik')}
            className="btn-secondary flex items-center justify-center"
          >
            <span className="mr-2">←</span>
            {t.backToDashboard}
          </button>
          
          {existingEntry && (
            <button
              onClick={() => router.push('/dashboard/saalik/history')}
              className="btn-primary flex items-center justify-center"
            >
              {t.viewHistory}
              <span className="ml-2">→</span>
            </button>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default SaalikEntryPage;
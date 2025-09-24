'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import { AuthProvider } from '../../contexts/AuthContext';
import { MultilingualProvider } from '../../hooks/useMultilingual';
import DailyEntryForm from '../../components/Entry/DailyEntryForm';

// Import multilingual config
import multilingualConfig from '../../config/multilingual.json';

export default function EntryPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C3E50',
          colorSuccess: '#2ECC71',
          colorWarning: '#F39C12',
          colorError: '#E74C3C',
          colorInfo: '#3498DB',
          borderRadius: 8,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        },
      }}
    >
      <MultilingualProvider config={multilingualConfig}>
        <AuthProvider>
          <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5',
            padding: '20px 0'
          }}>
            <DailyEntryForm />
          </div>
        </AuthProvider>
      </MultilingualProvider>
    </ConfigProvider>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Space, Alert, Select } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, GlobalOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useMultilingual } from '../../hooks/useMultilingual';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { login, user } = useAuth();
  const { t, getCurrentFont, changeLanguage, currentLanguage, supportedLanguages, languages } = useMultilingual();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        Saalik: '/dashboard/saalik',
        Murabi: '/dashboard/murabi',
        Masool: '/dashboard/masool',
        Sheikh: '/dashboard/sheikh',
        Admin: '/dashboard/admin'
      };
      router.push(roleRoutes[user.role] || '/dashboard');
    }
  }, [user, router]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: theme.getGradient('primary'),
      fontFamily: theme.getFont('primary')
    }}>
      {/* Language Switcher */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <Select
          value={currentLanguage}
          onChange={changeLanguage}
          style={{
            width: '120px',
            borderRadius: theme.getRadius('xl')
          }}
          size="large"
          suffixIcon={<GlobalOutlined style={{ color: theme.getColor('primary', 500) }} />}
          styles={{
            popup: {
              root: {
                borderRadius: theme.getRadius('xl'),
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }
            }
          }}
        >
          {supportedLanguages.map(lang => (
            <Select.Option key={lang} value={lang}>
              <Space>
                <span>{languages[lang]?.flag}</span>
                <span style={{ fontFamily: getCurrentFont('primary') }}>
                  {languages[lang]?.name}
                </span>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </div>

      <div style={{ width: '100%', maxWidth: '448px' }}>
        {/* Logo and Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in-up">
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div 
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.getGradient('primary'),
                boxShadow: theme.getShadow('glow')
              }}
            >
              <img 
                src="/logo.svg" 
                alt="Al-Burhan Logo" 
                style={{ width: '40px', height: '40px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <UserOutlined 
                style={{ fontSize: '24px', color: 'white', display: 'none' }}
              />
            </div>
            <Title 
              level={2} 
              className="text-gradient"
              style={{ 
                fontFamily: getCurrentFont('display'),
                margin: '0 0 8px 0'
              }}
            >
              {t('app.title')}
            </Title>
            <Text 
              style={{ 
                fontSize: '18px',
                color: theme.getColor('neutral', 600),
                fontFamily: getCurrentFont('primary')
              }}
            >
              {t('app.subtitle')}
            </Text>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-card animate-slide-in-right" style={{ padding: '32px' }}>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ 
                marginBottom: '24px',
                borderRadius: theme.getBorderRadius('xl'),
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            />
          )}

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: theme.getColor('neutral', 700) }}>{t('auth.emailOrPhone', 'Email or Phone')}</span>}
              rules={[
                { required: true, message: t('auth.emailOrPhoneRequired', 'Email or phone is required') }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: theme.getColor('primary', 500) }} />}
                placeholder={t('auth.emailOrPhonePlaceholder', 'Enter email or phone number')}
                style={{
                  borderRadius: theme.getRadius('xl'),
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontFamily: getCurrentFont('primary'),
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600, color: theme.getColor('neutral', 700) }}>{t('auth.password')}</span>}
              rules={[
                { required: true, message: t('auth.passwordRequired') },
                { min: 6, message: t('auth.passwordMinLength') }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: theme.getColor('primary', 500) }} />}
                placeholder={t('auth.passwordPlaceholder')}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{
                  borderRadius: theme.getRadius('xl'),
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontFamily: getCurrentFont('primary'),
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '24px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '52px',
                  borderRadius: theme.getRadius('xl'),
                  fontSize: '16px',
                  fontWeight: '600',
                  background: theme.getGradient('primary'),
                  border: 'none',
                  boxShadow: theme.getShadow('glow'),
                  fontFamily: getCurrentFont('primary'),
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? t('auth.signingIn') : t('auth.loginButton')}
              </Button>
            </Form.Item>
          </Form>

          {/* Demo Accounts */}
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
            borderRadius: theme.getRadius('2xl'),
            border: '1px solid rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.getColor('neutral', 800),
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              fontFamily: theme.getFont('primary')
            }}>
              Demo Accounts
            </h3>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
               <div style={{
                 padding: '12px',
                 borderRadius: theme.getRadius('xl'),
                 background: `rgba(${theme.getColorRGB('primary', 500)}, 0.1)`,
                 border: `1px solid rgba(${theme.getColorRGB('primary', 500)}, 0.2)`,
                 backdropFilter: 'blur(10px)'
               }}>
                 <Text strong style={{ color: theme.getColor('primary', 600), fontFamily: theme.getFont('primary') }}>Admin:</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>abdullah@example.com / admin123</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>+92-316-7890123 / admin123</Text>
               </div>
               <div style={{
                 padding: '12px',
                 borderRadius: theme.getRadius('xl'),
                 background: `rgba(${theme.getColorRGB('secondary', 500)}, 0.1)`,
                 border: `1px solid rgba(${theme.getColorRGB('secondary', 500)}, 0.2)`,
                 backdropFilter: 'blur(10px)'
               }}>
                 <Text strong style={{ color: theme.getColor('secondary', 600), fontFamily: theme.getFont('primary') }}>Murabi:</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>ali.raza@example.com / murabi123</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>+92-304-5678901 / murabi123</Text>
               </div>
               <div style={{
                 padding: '12px',
                 borderRadius: theme.getRadius('xl'),
                 background: `rgba(${theme.getColorRGB('success', 500)}, 0.1)`,
                 border: `1px solid rgba(${theme.getColorRGB('success', 500)}, 0.2)`,
                 backdropFilter: 'blur(10px)'
               }}>
                 <Text strong style={{ color: theme.getColor('success', 600), fontFamily: theme.getFont('primary') }}>Saalik:</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>ahmad.ali@example.com / saalik123</Text>
                 <br />
                 <Text code style={{ 
                   background: 'rgba(255,255,255,0.5)', 
                   padding: '2px 6px', 
                   borderRadius: '4px',
                   fontFamily: theme.getFont('mono')
                 }}>+92-300-1234567 / saalik123</Text>
               </div>
             </Space>
          </div>

          {/* Responsive Design Indicators */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ display: 'block' }} className="mobile-only">
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: theme.getFont('primary') }}>📱 Mobile View</Text>
            </div>
            <div style={{ display: 'none' }} className="tablet-only">
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: theme.getFont('primary') }}>💻 Tablet View</Text>
            </div>
            <div style={{ display: 'none' }} className="desktop-only">
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: theme.getFont('primary') }}>🖥️ Desktop View</Text>
            </div>
          </div>

          <div className="text-center mt-6">
            <Text style={{ 
              fontSize: '14px',
              color: theme.getColor('neutral', 500),
              fontFamily: theme.getFont('primary')
            }}>
              © 2024 {theme.config.branding.organization}. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
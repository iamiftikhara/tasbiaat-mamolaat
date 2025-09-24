'use client';

import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Button, Typography, Space, Badge, Input, Select, Tooltip } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useMultilingual } from '../hooks/useMultilingual';
import useTheme from '../hooks/useTheme';

const { Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const Navbar = ({ collapsed, onToggle, onSearch }) => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useMultilingual();
  const theme = useTheme();
  const [notifications] = useState([
    { id: 1, title: 'New submission', message: 'Ahmad has submitted today\'s entry', time: '5 min ago' },
    { id: 2, title: 'Weekly report', message: 'Your weekly report is ready', time: '1 hour ago' },
    { id: 3, title: 'Level update', message: 'Congratulations! You\'ve reached level 5', time: '2 hours ago' }
  ]);

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('navbar.profile', 'Profile'),
      onClick: () => {
        // Handle profile navigation
        console.log('Navigate to profile');
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('navbar.settings', 'Settings'),
      onClick: () => {
        // Handle settings navigation
        console.log('Navigate to settings');
      }
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('navbar.logout', 'Logout'),
      onClick: logout,
      danger: true
    }
  ];

  // Notifications dropdown menu
  const notificationMenuItems = notifications.map(notification => ({
    key: notification.id,
    label: (
      <div className="p-2 max-w-xs">
        <div className="font-medium text-sm">{notification.title}</div>
        <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
        <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
      </div>
    )
  }));

  // Language options
  const languageOptions = supportedLanguages.map(lang => ({
    value: lang.code,
    label: (
      <Space>
        <span>{lang.flag}</span>
        <span>{lang.name}</span>
      </Space>
    )
  }));

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
  };

  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: theme.getColor('neutral', 0),
        borderBottom: `1px solid ${theme.getColor('neutral', 200)}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Sidebar Toggle */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
            color: theme.getColor('primary', 600)
          }}
        />

        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${theme.getColor('primary', 500)}, ${theme.getColor('primary', 700)})`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span style={{ fontSize: '20px' }}>🕌</span>
          </div>
          {!collapsed && (
            <div>
              <Title level={4} style={{ margin: 0, color: theme.getColor('neutral', 800) }}>
                {t('app.title', 'Al-Burhan')}
              </Title>
              <Text style={{ fontSize: '12px', color: theme.getColor('neutral', 500) }}>
                {t('app.subtitle', 'Islamic Development')}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Search */}
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px' }}>
        <Search
          placeholder={t('navbar.searchPlaceholder', 'Search...')}
          allowClear
          onSearch={handleSearch}
          style={{ width: '100%' }}
          size="middle"
        />
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Language Selector */}
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          options={languageOptions}
          style={{ width: 120 }}
          size="middle"
          suffixIcon={<GlobalOutlined />}
        />

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={
              <Badge count={notifications.length} size="small">
                <BellOutlined style={{ fontSize: '16px' }} />
              </Badge>
            }
            style={{
              width: 40,
              height: 40,
              color: theme.getColor('neutral', 600)
            }}
          />
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: theme.getColor('neutral', 50)
              }
            }}
          >
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                backgroundColor: theme.getColor('primary', 500)
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: theme.getColor('neutral', 800),
                  lineHeight: 1.2
                }}
              >
                {user?.name || 'User'}
              </Text>
              <Text
                style={{
                  fontSize: '12px',
                  color: theme.getColor('neutral', 500),
                  lineHeight: 1.2,
                  textTransform: 'capitalize'
                }}
              >
                {user?.role || 'Member'}
              </Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
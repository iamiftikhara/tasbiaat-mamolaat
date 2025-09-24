'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Space, Divider, Badge, Tooltip } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  EditOutlined,
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
  SafetyOutlined,
  CrownOutlined,
  HomeOutlined,
  HistoryOutlined,
  TrophyOutlined,
  SettingOutlined,
  ExportOutlined,
  PieChartOutlined,
  GlobalOutlined,
  AuditOutlined,
  KeyOutlined,
  DatabaseOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useMultilingual } from '../hooks/useMultilingual';
import useTheme from '../hooks/useTheme';

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = ({ collapsed, onCollapse }) => {
  const { user } = useAuth();
  const { t } = useMultilingual();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Update selected keys based on current pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      setSelectedKeys([pathSegments[pathSegments.length - 1]]);
    }
  }, [pathname]);

  // Role-based navigation items
  const getNavigationItems = (userRole) => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <HomeOutlined />,
        label: t('navigation.dashboard', 'Dashboard'),
        onClick: () => router.push('/dashboard')
      }
    ];

    const roleBasedItems = {
      'Saalik': [
        {
          key: 'entry',
          icon: <EditOutlined />,
          label: t('navigation.dailyEntry', 'Daily Entry'),
          onClick: () => router.push('/dashboard/saalik/entry')
        },
        {
          key: 'history',
          icon: <HistoryOutlined />,
          label: t('navigation.history', 'My History'),
          onClick: () => router.push('/dashboard/saalik/history')
        },
        {
          key: 'progress',
          icon: <BarChartOutlined />,
          label: t('navigation.progress', 'My Progress'),
          onClick: () => router.push('/dashboard/saalik/progress')
        },
        {
          key: 'quran',
          icon: <BookOutlined />,
          label: t('navigation.quran', 'Quran'),
          onClick: () => router.push('/dashboard/saalik/quran')
        },
        {
          key: 'calendar',
          icon: <CalendarOutlined />,
          label: t('navigation.calendar', 'Calendar'),
          onClick: () => router.push('/dashboard/saalik/calendar')
        }
      ],
      'Murabi': [
        {
          key: 'students',
          icon: <TeamOutlined />,
          label: t('navigation.students', 'My Students'),
          onClick: () => router.push('/dashboard/murabi/students'),
          badge: 5 // Example: 5 pending reviews
        },
        {
          key: 'review',
          icon: <AuditOutlined />,
          label: t('navigation.review', 'Review Submissions'),
          onClick: () => router.push('/dashboard/murabi/review')
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: t('navigation.reports', 'Reports'),
          onClick: () => router.push('/dashboard/murabi/reports')
        },
        {
          key: 'messages',
          icon: <MessageOutlined />,
          label: t('navigation.messages', 'Messages'),
          onClick: () => router.push('/dashboard/murabi/messages'),
          badge: 3 // Example: 3 unread messages
        },
        {
          key: 'analytics',
          icon: <PieChartOutlined />,
          label: t('navigation.analytics', 'Analytics'),
          onClick: () => router.push('/dashboard/murabi/analytics')
        }
      ],
      'Masool': [
        {
          key: 'murabi-management',
          icon: <SafetyOutlined />,
          label: t('navigation.murabiManagement', 'Murabi Management'),
          onClick: () => router.push('/dashboard/masool/murabi-management')
        },
        {
          key: 'weekly-reports',
          icon: <FileTextOutlined />,
          label: t('navigation.weeklyReports', 'Weekly Reports'),
          onClick: () => router.push('/dashboard/masool/reports')
        },
        {
          key: 'region-reports',
          icon: <GlobalOutlined />,
          label: t('navigation.regionReports', 'Region Reports'),
          onClick: () => router.push('/dashboard/masool/region-reports')
        },
        {
          key: 'export',
          icon: <ExportOutlined />,
          label: t('navigation.exportData', 'Export Data'),
          onClick: () => router.push('/dashboard/masool/export')
        },
        {
          key: 'oversight',
          icon: <CrownOutlined />,
          label: t('navigation.oversight', 'Oversight'),
          onClick: () => router.push('/dashboard/masool/oversight')
        }
      ],
      'Sheikh': [
        {
          key: 'monthly-reports',
          icon: <FileTextOutlined />,
          label: t('navigation.monthlyReports', 'Monthly Reports'),
          onClick: () => router.push('/dashboard/sheikh/reports')
        },
        {
          key: 'regional-view',
          icon: <GlobalOutlined />,
          label: t('navigation.regionalView', 'Regional View'),
          onClick: () => router.push('/dashboard/sheikh/regions')
        },
        {
          key: 'analytics',
          icon: <PieChartOutlined />,
          label: t('navigation.analytics', 'Analytics'),
          onClick: () => router.push('/dashboard/sheikh/analytics')
        },
        {
          key: 'oversight',
          icon: <CrownOutlined />,
          label: t('navigation.oversight', 'Oversight'),
          onClick: () => router.push('/dashboard/sheikh/oversight')
        },
        {
          key: 'notifications',
          icon: <BellOutlined />,
          label: t('navigation.notifications', 'Notifications'),
          onClick: () => router.push('/dashboard/sheikh/notifications')
        }
      ],
      'Admin': [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: t('navigation.userManagement', 'User Management'),
          onClick: () => router.push('/dashboard/admin/users')
        },
        {
          key: 'roles',
          icon: <KeyOutlined />,
          label: t('navigation.roleAssignment', 'Role Assignment'),
          onClick: () => router.push('/dashboard/admin/roles')
        },
        {
          key: 'system-reports',
          icon: <FileTextOutlined />,
          label: t('navigation.systemReports', 'System Reports'),
          onClick: () => router.push('/dashboard/admin/reports')
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: t('navigation.systemSettings', 'System Settings'),
          onClick: () => router.push('/dashboard/admin/settings')
        },
        {
          key: 'audit',
          icon: <AuditOutlined />,
          label: t('navigation.auditLogs', 'Audit Logs'),
          onClick: () => router.push('/dashboard/admin/audit')
        },
        {
          key: 'database',
          icon: <DatabaseOutlined />,
          label: t('navigation.database', 'Database'),
          onClick: () => router.push('/dashboard/admin/database')
        }
      ]
    };

    return [...baseItems, ...(roleBasedItems[userRole] || [])];
  };

  const navigationItems = getNavigationItems(user?.role);

  // Convert navigation items to Ant Design Menu items
  const menuItems = navigationItems.map(item => ({
    key: item.key,
    icon: item.badge ? (
      <Badge count={item.badge} size="small" offset={[10, 0]}>
        {item.icon}
      </Badge>
    ) : item.icon,
    label: item.label,
    onClick: item.onClick
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      collapsedWidth={80}
      style={{
        background: theme.getColor('neutral', 0),
        borderRight: `1px solid ${theme.getColor('neutral', 200)}`,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
        overflow: 'auto'
      }}
    >
      {/* User Profile Section */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '24px 16px',
          borderBottom: `1px solid ${theme.getColor('neutral', 200)}`,
          background: `linear-gradient(135deg, ${theme.getColor('primary', 50)}, ${theme.getColor('primary', 100)})`,
          marginTop: '64px' // Account for fixed navbar height
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? '0' : '12px',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          <Avatar
            size={collapsed ? 40 : 48}
            icon={<UserOutlined />}
            style={{
              backgroundColor: theme.getColor('primary', 500),
              border: `2px solid ${theme.getColor('neutral', 0)}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title
                level={5}
                style={{
                  margin: 0,
                  color: theme.getColor('neutral', 800),
                  fontSize: '16px',
                  fontWeight: 600
                }}
                ellipsis
              >
                {user?.name || 'User'}
              </Title>
              <Text
                style={{
                  fontSize: '12px',
                  color: theme.getColor('neutral', 600),
                  textTransform: 'capitalize',
                  fontWeight: 500
                }}
              >
                {user?.role || 'Member'}
              </Text>
              {user?.level && (
                <div style={{ marginTop: '4px' }}>
                  <Badge
                    count={`Level ${user.level}`}
                    style={{
                      backgroundColor: theme.getColor('success', 500),
                      fontSize: '10px',
                      height: '18px',
                      lineHeight: '18px',
                      borderRadius: '9px'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: '16px 0' }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          style={{
            border: 'none',
            background: 'transparent'
          }}
          theme="light"
          inlineIndent={collapsed ? 0 : 24}
        />
      </div>

      {/* Footer Section */}
      {!collapsed && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: `1px solid ${theme.getColor('neutral', 200)}`,
            background: theme.getColor('neutral', 50)
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Text
              style={{
                fontSize: '12px',
                color: theme.getColor('neutral', 500)
              }}
            >
              {t('app.version', 'Version 1.0.0')}
            </Text>
            <br />
            <Text
              style={{
                fontSize: '11px',
                color: theme.getColor('neutral', 400)
              }}
            >
              © 2025 Al-Burhan
            </Text>
          </div>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;
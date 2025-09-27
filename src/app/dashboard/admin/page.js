'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import RoleGuard from '../../../components/RoleGuard';
import { ComponentLoader, SkeletonLoaders } from '../../../components/Loaders';
import { 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Avatar, 
  List,
  Progress,
  Tabs,
  Badge,
  Switch,
  Alert,
  Divider
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const { user, language, apiCall } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSaaliks: 0,
    totalMurabis: 0,
    activeEntries: 0,
    pendingReviews: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const translations = {
    en: {
      title: 'Admin Dashboard',
      overview: 'Overview',
      userManagement: 'User Management',
      systemSettings: 'System Settings',
      totalUsers: 'Total Users',
      totalSaaliks: 'Total Saaliks',
      totalMurabis: 'Total Murabis',
      activeEntries: 'Active Entries Today',
      pendingReviews: 'Pending Reviews',
      recentUsers: 'Recent Users',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      active: 'Active',
      inactive: 'Inactive',
      addUser: 'Add New User',
      exportData: 'Export Data',
      systemHealth: 'System Health',
      databaseStatus: 'Database Status',
      serverStatus: 'Server Status',
      backupStatus: 'Backup Status',
      lastBackup: 'Last Backup',
      createBackup: 'Create Backup'
    },
    ur: {
      title: 'ایڈمن ڈیش بورڈ',
      overview: 'جائزہ',
      userManagement: 'صارف کا انتظام',
      systemSettings: 'سسٹم کی ترتیبات',
      totalUsers: 'کل صارفین',
      totalSaaliks: 'کل سالکین',
      totalMurabis: 'کل مربیان',
      activeEntries: 'آج کے فعال اندراجات',
      pendingReviews: 'زیر التواء جائزے',
      recentUsers: 'حالیہ صارفین',
      name: 'نام',
      email: 'ای میل',
      role: 'کردار',
      status: 'حالت',
      actions: 'اعمال',
      edit: 'تبدیل کریں',
      delete: 'حذف کریں',
      active: 'فعال',
      inactive: 'غیر فعال',
      addUser: 'نیا صارف شامل کریں',
      exportData: 'ڈیٹا ایکسپورٹ کریں',
      systemHealth: 'سسٹم کی صحت',
      databaseStatus: 'ڈیٹابیس کی حالت',
      serverStatus: 'سرور کی حالت',
      backupStatus: 'بیک اپ کی حالت',
      lastBackup: 'آخری بیک اپ',
      createBackup: 'بیک اپ بنائیں'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin statistics
      const statsResponse = await apiCall('/api/admin/stats');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch recent users
      const usersResponse = await apiCall('/api/admin/users?limit=10');
      if (usersResponse.success) {
        setUsers(usersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await apiCall(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className={`card gradient-card hover:shadow-modern transition-all duration-300 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`h-16 w-16 bg-${color}-100 rounded-2xl flex items-center justify-center text-3xl`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['Admin']}>
          <div className={`min-h-screen bg-gray-50 ${language === 'ur' ? 'rtl font-urdu' : 'ltr'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                <SkeletonLoaders.CardSkeleton />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SkeletonLoaders.WidgetSkeleton />
                  <SkeletonLoaders.WidgetSkeleton />
                  <SkeletonLoaders.WidgetSkeleton />
                  <SkeletonLoaders.WidgetSkeleton />
                </div>
                <SkeletonLoaders.TableSkeleton />
                <SkeletonLoaders.ChartSkeleton />
              </div>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['Admin']}>
        <div className={`min-h-screen bg-gray-50 ${language === 'ur' ? 'rtl font-urdu' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <Card className="!bg-gradient-to-r !from-blue-900 !via-blue-800 !to-indigo-900 !border-0 !text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Title level={1} className="!text-white !mb-2">
                  <SettingOutlined className="mr-3" />
                  {t.title}
                </Title>
                <Text className="!text-blue-100 !text-lg">
                  Welcome back, <span className="!text-white !font-semibold">{user?.name || 'Admin'}</span>
                </Text>
              </div>
              <div className="hidden md:block text-right">
                <Text className="!text-blue-200">
                  {new Date().toLocaleDateString()}
                </Text>
                <br />
                <Space className="mt-2">
                  <Badge status="processing" />
                  <Text className="!text-white !font-medium">System Status: Operational</Text>
                </Space>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-2 bg-white rounded-xl p-2 shadow-sm border border-slate-200">
              {[
                { id: 'overview', label: t.overview },
                { id: 'users', label: t.userManagement },
                { id: 'settings', label: t.systemSettings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 border-b-3 font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-gradient-to-t from-blue-50 to-transparent'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-gradient-to-t hover:from-slate-50 hover:to-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistics Cards */}
              <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <Statistic
                      title={<span className="!font-semibold !text-slate-600">{t.totalUsers}</span>}
                      value={stats.totalUsers}
                      prefix={<TeamOutlined className="!text-blue-600" />}
                      valueStyle={{ color: '#2563eb', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <Statistic
                      title={<span className="!font-semibold !text-slate-600">{t.totalMurabis}</span>}
                      value={stats.totalMurabis}
                      prefix={<UserOutlined className="!text-purple-600" />}
                      valueStyle={{ color: '#9333ea', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <Statistic
                      title={<span className="!font-semibold !text-slate-600">{t.totalSaaliks}</span>}
                      value={stats.totalSaaliks}
                      prefix={<CheckCircleOutlined className="!text-emerald-600" />}
                      valueStyle={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <Statistic
                      title={<span className="!font-semibold !text-slate-600">{t.activeEntries}</span>}
                      value={stats.activeEntries}
                      prefix={<DatabaseOutlined className="!text-orange-600" />}
                      valueStyle={{ color: '#ea580c', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* System Health */}
              <div className="card shadow-modern">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-slate-800">{t.systemHealth}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <span className="font-semibold text-slate-800">{t.databaseStatus}</span>
                    <span className="status-success">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <span className="font-semibold text-slate-800">{t.serverStatus}</span>
                    <span className="status-success">Running</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                    <span className="font-semibold text-slate-800">{t.backupStatus}</span>
                    <span className="status-warning">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{t.recentUsers}</h3>
                <div className="space-x-4">
                  <button className="btn btn-outline">{t.exportData}</button>
                  <button className="btn btn-primary">{t.addUser}</button>
                </div>
              </div>

              {/* Users Table */}
              <div className="card shadow-modern overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {t.name}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {t.email}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {t.role}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {t.status}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {t.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-800">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={user.active ? 'status-success' : 'status-danger'}>
                              {user.active ? t.active : t.inactive}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="btn btn-outline btn-sm">
                              {t.edit}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-danger btn-sm"
                            >
                              {t.delete}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="card shadow-modern">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-slate-800">Backup Management</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div>
                      <p className="font-semibold text-slate-800">{t.lastBackup}</p>
                      <p className="text-sm text-slate-600">2024-01-15 10:30 AM</p>
                    </div>
                    <button className="btn btn-primary">{t.createBackup}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
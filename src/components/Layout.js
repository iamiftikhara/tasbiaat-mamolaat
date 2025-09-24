'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Spin } from 'antd';

const Layout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🕌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tasbiaat & Mamolaat
          </h1>
          <p className="text-gray-600 mb-8">
            Islamic Spiritual Tracking Platform
          </p>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // If user is not authenticated, show children (login page) without layout
  if (!user) {
    return children;
  }

  // If user is authenticated but on login page, redirect will be handled by the login page component
  if (pathname === '/login') {
    return children;
  }

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: `/dashboard/${user.role}`, icon: '🏠' },
    ];

    switch (user.role) {
      case 'saalik':
        return [
          ...baseItems,
          { name: 'Daily Entry', href: '/dashboard/saalik/entry', icon: '📝' },
          { name: 'History', href: '/dashboard/saalik/history', icon: '📊' },
          { name: 'Progress', href: '/dashboard/saalik/progress', icon: '📈' },
        ];
      case 'murabi':
        return [
          ...baseItems,
          { name: 'Review Submissions', href: '/dashboard/murabi/review', icon: '👁️' },
          { name: 'My Saaliks', href: '/dashboard/murabi/saaliks', icon: '👥' },
        ];
      case 'masool':
        return [
          ...baseItems,
          { name: 'Weekly Reports', href: '/dashboard/masool/reports', icon: '📋' },
          { name: 'Export Data', href: '/dashboard/masool/export', icon: '💾' },
        ];
      case 'sheikh':
        return [
          ...baseItems,
          { name: 'Monthly Reports', href: '/dashboard/sheikh/reports', icon: '📊' },
          { name: 'Regional View', href: '/dashboard/sheikh/regions', icon: '🗺️' },
          { name: 'Analytics', href: '/dashboard/sheikh/analytics', icon: '📈' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { name: 'User Management', href: '/dashboard/admin/users', icon: '👤' },
          { name: 'Role Assignment', href: '/dashboard/admin/roles', icon: '🔐' },
          { name: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen gradient-secondary">
      {/* Header */}
      <header className="bg-white shadow-modern border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🕌</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Al-Burhan
                </h1>
                <p className="text-sm text-slate-500">
                  Islamic Development
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:block">
                <span className="text-sm font-medium text-slate-700">
                  Welcome, <span className="text-blue-800 font-semibold">{user?.name || 'User'}</span>
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-72 bg-white shadow-modern min-h-screen border-r border-blue-100">
          <div className="p-6">
            {/* User Profile Card */}
            <div className="card-compact mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role || 'Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? 'nav-item-active' : 'nav-item'}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
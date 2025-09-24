import React, { useState } from 'react';
import { Layout } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useMultilingual } from '../hooks/useMultilingual';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { t } = useMultilingual();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality here
    console.log('Search query:', query);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
      />
      
      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
        {/* Navbar */}
        <Navbar 
          collapsed={collapsed}
          onToggle={handleToggleSidebar}
          onSearch={handleSearch}
        />
        
        {/* Content */}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            minHeight: 'calc(100vh - 112px)', // Account for navbar height and margins
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Result, Button, Spin } from 'antd';
import { AuthContext } from '../contexts/AuthContext';

const RoleGuard = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Handle redirect in useEffect to avoid calling during render
  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!hasPermission) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  // User is authenticated and has permission
  return children;
};

export default RoleGuard;
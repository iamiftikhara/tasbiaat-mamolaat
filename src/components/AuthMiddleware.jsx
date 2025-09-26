'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

// Routes that should redirect authenticated users
const AUTH_ROUTES = ['/login', '/register'];

export default function AuthMiddleware({ children }) {
  const { user, loading, authToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isAuthenticated = user && authToken;

    // If user is authenticated and on auth route, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      const roleRoutes = {
        Saalik: '/dashboard/saalik',
        Murabi: '/dashboard/murabi',
        Masool: '/dashboard/masool',
        Sheikh: '/dashboard/sheikh',
        Admin: '/dashboard/admin'
      };
      
      router.push(roleRoutes[user.role] || '/dashboard');
      return;
    }

    // If user is not authenticated and not on public route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
      return;
    }
  }, [user, loading, authToken, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#EBF5FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '4px solid #DBEAFE',
            borderTopColor: '#2563EB',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid #DBEAFE',
            borderBottomColor: '#2563EB',
            animation: 'spin 1.2s linear infinite',
            position: 'absolute',
            top: '8px',
            left: '8px'
          }}></div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '4px solid #DBEAFE',
            borderLeftColor: '#2563EB',
            animation: 'spin 1.5s linear infinite',
            position: 'absolute',
            top: '16px',
            left: '16px'
          }}></div>
          <p style={{
            color: '#2563EB',
            fontWeight: '500',
            marginTop: '16px',
            textAlign: 'center'
          }}>Loading...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return children;
}
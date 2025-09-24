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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return children;
}
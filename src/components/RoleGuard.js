'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        const roleRoutes = {
          saalik: '/dashboard/saalik',
          murabi: '/dashboard/murabi',
          masool: '/dashboard/masool',
          sheikh: '/dashboard/sheikh',
          admin: '/dashboard/admin'
        };
        router.push(roleRoutes[user.role] || '/dashboard');
        return;
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default RoleGuard;
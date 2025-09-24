'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If no user or token, redirect to login
    if (!user || !authToken) {
      router.push('/login');
      return;
    }
  }, [user, loading, authToken, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user || !authToken) {
    return null;
  }

  return children;
}
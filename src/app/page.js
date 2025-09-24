'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/Loaders';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not logged in, redirect to login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Show full page loader while checking authentication
  return (
    <FullPageLoader 
      variant="branded" 
      message="جاري تحميل التطبيق..."
    />
  );
}

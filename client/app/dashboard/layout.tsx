'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Only redirect if we are officially not authenticated AND not loading
    const rawHasToken = typeof window !== 'undefined' ? localStorage.getItem('mini-eraser-auth')?.includes('token') : false;
    
    if (!isLoading && !isAuthenticated && !rawHasToken) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-bg">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  // Prevent flash of content before redirect
  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('mini-eraser-auth')?.includes('token')) {
      return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-dark-text">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

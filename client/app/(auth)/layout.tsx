'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  React.useEffect(() => {
    if (isAuthenticated && pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, pathname]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-4 canvas-bg">
      <div className="absolute inset-0 bg-brand-500/5 backdrop-blur-[1px]" />
      
      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="mb-8 flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-brand">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
        
        <div className="glass p-8 rounded-2xl border border-dark-border shadow-2xl">
          {children}
        </div>
        
        <p className="text-center text-dark-subtle text-xs mt-8 pb-4">
          &copy; {new Date().getFullYear()} Mini Eraser. Developer focused design tools.
        </p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const handleLogout = () => {
    clearAuth();
    // remove token from local storage managed by zustand persist automatically
    toast.success('Logged out');
    router.push('/');
  };

  const navItems = [
    { label: 'Workspaces', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  if (!sidebarOpen) {
    return (
      <div className="w-0 bg-dark-bg transition-all h-screen border-r border-dark-border overflow-hidden" />
    );
  }

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border h-screen flex flex-col transition-all flex-shrink-0">
      <div className="p-4 border-b border-dark-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <span className="font-bold tracking-tight text-white hidden sm:block">
          Mini Eraser
        </span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 px-3">
        <div className="text-xs font-semibold text-dark-subtle mb-2 px-3 uppercase tracking-wider">Menu</div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-dark-subtle hover:text-white hover:bg-dark-elevated'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-brand-400' : ''} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-dark-subtle truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-dark-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white font-bold text-2xl shadow-glow-brand">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-white font-medium text-lg">{user?.name}</p>
              <p className="text-dark-subtle">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-sm text-dark-subtle">Switch between dark and light mode (coming soon)</p>
            </div>
            <button
              disabled
              onClick={toggleTheme}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm font-medium text-white opacity-50 cursor-not-allowed"
            >
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAutosave } from '@/hooks/useAutosave';
import Toolbar from '@/components/Toolbar';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import AIChatBox from '@/components/AIChatBox';

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { workspace, reload } = useWorkspace(id);
  
  // Initialize autosave hook
  useAutosave(id);

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dark-border border-t-brand-500 rounded-full animate-spin" />
          <p className="text-dark-subtle font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col w-full bg-dark-bg overflow-hidden relative">
      <Toolbar />
      <WorkspaceLayout />
      <AIChatBox />
    </div>
  );
}

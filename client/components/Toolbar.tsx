'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useUiStore } from '@/store/uiStore';
import { PanelLeftClose, PanelRightClose, Columns, Cpu, Share2, ArrowLeft, Download, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Toolbar() {
  const router = useRouter();
  const { currentWorkspace, lastSaved, isSaving, updateTitle } = useWorkspaceStore();
  const { panelMode, setPanelMode, toggleAiPanel } = useUiStore();

  if (!currentWorkspace) return null;

  return (
    <div className="h-14 border-b border-dark-border bg-dark-bg/80 backdrop-blur flex items-center justify-between px-4 z-10 flex-shrink-0 relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => router.push('/dashboard')}
          className="btn-ghost !p-2 text-dark-subtle"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="h-6 w-px bg-dark-border mx-1" />
        
        <div className="flex-1 max-w-[300px]">
          <input
            type="text"
            value={currentWorkspace.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full bg-transparent border-none text-white font-semibold focus:outline-none focus:ring-0 placeholder-dark-muted"
            placeholder="Untitled Workspace"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center absolute left-1/2 -translate-x-1/2">
        <div className="flex rounded-lg bg-dark-elevated p-1 shadow-inner-brand">
          <button
            onClick={() => setPanelMode('canvas-only')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
              panelMode === 'canvas-only'
                ? 'bg-brand-600/20 text-brand-400 shadow-sm'
                : 'text-dark-subtle hover:text-white'
            }`}
          >
            <PanelRightClose size={14} />
            Canvas
          </button>
          <button
            onClick={() => setPanelMode('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
              panelMode === 'split'
                ? 'bg-brand-600/20 text-brand-400 shadow-sm'
                : 'text-dark-subtle hover:text-white'
            }`}
          >
            <Columns size={14} />
            Split
          </button>
          <button
            onClick={() => setPanelMode('editor-only')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
              panelMode === 'editor-only'
                ? 'bg-brand-600/20 text-brand-400 shadow-sm'
                : 'text-dark-subtle hover:text-white'
            }`}
          >
            <PanelLeftClose size={14} />
            Notes
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="text-xs text-dark-subtle hidden sm:flex items-center gap-2">
          {isSaving ? (
            <span className="flex items-center gap-2 text-brand-400">
               <span className="w-3 h-3 rounded-full border border-brand-400/30 border-t-brand-400 animate-spin" />
               Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved
            </span>
          ) : null}
        </div>

        <div className="h-6 w-px bg-dark-border mx-1 hidden sm:block" />

        <button
          onClick={toggleAiPanel}
          className="btn-primary !px-3 font-semibold relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-2 z-10">
            <Cpu size={16} />
            <span className="hidden md:inline">Generate AI</span>
          </div>
        </button>

        <button onClick={() => toast('Export menu coming soon!')} className="btn-ghost !px-3 hidden sm:flex">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

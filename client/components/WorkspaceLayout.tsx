'use client';

import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useUiStore } from '@/store/uiStore';
import CanvasEditor from '@/components/CanvasEditor';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function WorkspaceLayout() {
  const { panelMode } = useUiStore();

  return (
    <div className="flex-1 h-full w-full overflow-hidden flex bg-dark-bg p-2 gap-2">
      {panelMode === 'split' ? (
        <PanelGroup direction="horizontal" className="h-full w-full">
          <Panel defaultSize={60} minSize={20} className="pr-1">
            <CanvasEditor />
          </Panel>
          
          <PanelResizeHandle className="w-1.5 mx-1 transition-colors hover:bg-brand-500/50 bg-dark-border rounded cursor-col-resize flex items-center justify-center">
            <div className="h-8 w-0.5 bg-dark-muted rounded-full pointer-events-none" />
          </PanelResizeHandle>
          
          <Panel defaultSize={40} minSize={20} className="pl-1">
            <MarkdownEditor />
          </Panel>
        </PanelGroup>
      ) : panelMode === 'canvas-only' ? (
        <div className="w-full h-full animate-fade-in">
          <CanvasEditor />
        </div>
      ) : (
        <div className="w-full h-full max-w-5xl mx-auto animate-fade-in">
          <MarkdownEditor />
        </div>
      )}
    </div>
  );
}

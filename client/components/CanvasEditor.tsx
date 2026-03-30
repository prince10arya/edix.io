'use client';

import React, { useCallback } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Tldraw, useEditor, TLRecord } from 'tldraw';
import 'tldraw/tldraw.css';

export default function CanvasEditor() {
  const { currentWorkspace, updateCanvasData } = useWorkspaceStore();
  
  const handleMount = useCallback((editor: ReturnType<typeof useEditor>) => {
    // Mount complete - editor is ready
    if (!editor) return;

    // Load initial data if it exists
    if (currentWorkspace?.canvasData?.tlDrawData) {
      try {
        const rawStore = currentWorkspace.canvasData.tlDrawData;
        const records = Object.values(rawStore) as TLRecord[];
        
        // Filter out instance-specific ephemeral state that crashes Tldraw on mount
        const blockList = ['instance', 'instance_page_state', 'pointer', 'user', 'user_document', 'user_presence'];
        const persistables = records.filter(r => !blockList.includes(r?.typeName));

        if (persistables.length > 0) {
           editor.store.loadSnapshot({
             store: Object.fromEntries(persistables.map(r => [r.id, r])) as any,
             schema: editor.store.schema.serialize()
           });
        }
      } catch (e) {
        console.error('Failed to load canvas snapshot:', e);
      }
    }

    // Subscribe to changes to trigger autosave
    editor.store.listen((entry) => {
      // Ignore presence changes
      if (entry.source !== 'user') return;
      
      try {
        const allRecords = editor.store.allRecords();
        const blockList = ['instance', 'instance_page_state', 'pointer', 'user', 'user_document', 'user_presence'];
        const recordsToSave = allRecords.filter(r => !blockList.includes(r?.typeName));
        
        updateCanvasData({
          nodes: [],
          edges: [],
          tlDrawData: Object.fromEntries(recordsToSave.map(r => [r.id, r])) as unknown as Record<string, unknown>
        });
      } catch(e) {
         // Gracefully handle unmounts
      }
    }, { scope: 'document', source: 'user' });

  }, [currentWorkspace?.canvasData?.tlDrawData, updateCanvasData]);

  if (!currentWorkspace) return null;

  return (
    <div className="w-full h-full bg-dark-bg canvas-bg tldraw-wrapper relative rounded-lg border border-dark-border overflow-hidden">
      <Tldraw 
        components={{ 
            PageMenu: null,
            NavigationPanel: null,
        }}
        onMount={handleMount} 
      />
    </div>
  );
}

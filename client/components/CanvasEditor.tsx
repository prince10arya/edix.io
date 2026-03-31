'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Tldraw, createTLStore, defaultShapeUtils, getSnapshot, loadSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';

// Keyed wrapper ensures Editor properly resets active state when switching workspaces
export default function CanvasEditorWrapper() {
  const { currentWorkspace } = useWorkspaceStore();
  if (!currentWorkspace) return null;

  return <CanvasEditor key={currentWorkspace._id as string} />;
}

function CanvasEditor() {
  const { currentWorkspace, updateCanvasData } = useWorkspaceStore();
  
  const [store] = useState(() => {
    let initialData = undefined;
    
    // Safely parse out the snapshot if it exists
    if (currentWorkspace?.canvasData?.tlDrawData) {
      const rawData = currentWorkspace.canvasData.tlDrawData as any;
      if (rawData && typeof rawData === 'object' && Object.keys(rawData).length > 0) {
        // Map the payload directly to how Tldraw expects it
        if (rawData.document || rawData.store) {
           initialData = rawData;
        }
      }
    }

    try {
      // Create the store WITH the initial payload natively injected to bypass all post-mount loading crashes
      return createTLStore({ 
         shapeUtils: defaultShapeUtils,
         initialData 
      });
    } catch (e) {
      console.error('Failed to parse saved canvas layout. Generating clean workspace.', e);
      return createTLStore({ shapeUtils: defaultShapeUtils });
    }
  });

  // 2. Track changes after mount Reactively via useEffect on the store
  useEffect(() => {
    // Listen to changes for debounced workspace persistence
    const unsubscribe = store.listen((entry) => {
      if (entry.source !== 'user') return;
      
      try {
        // Use native getSnapshot to preserve the exactly format loadSnapshot expects
        const snapshot = getSnapshot(store);
        
        updateCanvasData({
          nodes: [],
          edges: [],
          tlDrawData: snapshot as unknown as Record<string, unknown>
        });
      } catch(e) {
         // Silently handle fast unmount interrupts
      }
    }, { scope: 'document', source: 'user' });

    return () => unsubscribe();
  }, [store, updateCanvasData]);

  if (!currentWorkspace) return null;

  return (
    <div className="w-full h-full bg-dark-bg canvas-bg tldraw-wrapper relative rounded-lg border border-dark-border overflow-hidden">
      <Tldraw 
        store={store}
        components={{ 
            PageMenu: null,
            NavigationPanel: null,
        }}
      />
    </div>
  );
}

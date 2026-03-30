import { useEffect, useRef, useCallback } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { workspaceService } from '@/services/workspaceService';
import toast from 'react-hot-toast';

const AUTOSAVE_DELAY_MS = 5000;

export function useAutosave(workspaceId: string | null) {
  const { currentWorkspace, hasUnsavedChanges, setSaving, setLastSaved, setHasUnsavedChanges } =
    useWorkspaceStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Keep fresh references for the unmount cleanup
  const stateRef = useRef({ hasUnsavedChanges, workspaceId, currentWorkspace });
  useEffect(() => {
    stateRef.current = { hasUnsavedChanges, workspaceId, currentWorkspace };
  }, [hasUnsavedChanges, workspaceId, currentWorkspace]);

  const save = useCallback(async () => {
    if (!workspaceId || !currentWorkspace || isSavingRef.current) return;

    isSavingRef.current = true;
    setSaving(true);

    try {
      await workspaceService.update(workspaceId, {
        title: currentWorkspace.title,
        canvasData: currentWorkspace.canvasData,
        markdownText: currentWorkspace.markdownText,
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch {
      toast.error('Autosave failed. Your changes may not be saved.');
    } finally {
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [workspaceId, currentWorkspace, setSaving, setLastSaved, setHasUnsavedChanges]);

  // Debounced autosave trigger
  useEffect(() => {
    if (!hasUnsavedChanges || !workspaceId) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasUnsavedChanges, save, workspaceId]);

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      const { hasUnsavedChanges: hasUnsaved, workspaceId: wId, currentWorkspace: cw } = stateRef.current;
      if (hasUnsaved && wId && cw && !isSavingRef.current) {
         // Perform synchronous request if possible, or isolated async
        workspaceService.update(wId, {
          title: cw.title,
          canvasData: cw.canvasData,
          markdownText: cw.markdownText,
        }).catch(() => {}); // silent catch on unmount
      }
    };
  }, []);

  return { save };
}

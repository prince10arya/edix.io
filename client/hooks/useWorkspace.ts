import { useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { workspaceService } from '@/services/workspaceService';
import toast from 'react-hot-toast';

export function useWorkspace(id: string | null) {
  const { setCurrentWorkspace, setLoading, currentWorkspace } = useWorkspaceStore();

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const workspace = await workspaceService.getById(id);
      setCurrentWorkspace(workspace);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load workspace';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id, setCurrentWorkspace, setLoading]);

  useEffect(() => {
    load();
    return () => {
      setCurrentWorkspace(null);
    };
  }, [id, load, setCurrentWorkspace]);

  return { workspace: currentWorkspace, reload: load };
}

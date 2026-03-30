'use client';
import { create } from 'zustand';
import { Workspace, WorkspaceListItem, CanvasData } from '@/types';

interface WorkspaceStore {
  workspaces: WorkspaceListItem[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;

  setWorkspaces: (workspaces: WorkspaceListItem[]) => void;
  addWorkspace: (workspace: WorkspaceListItem) => void;
  removeWorkspace: (id: string) => void;
  updateWorkspaceInList: (id: string, updates: Partial<WorkspaceListItem>) => void;

  setCurrentWorkspace: (workspace: Workspace | null) => void;
  updateCanvasData: (canvasData: CanvasData) => void;
  updateMarkdown: (markdown: string) => void;
  updateTitle: (title: string) => void;

  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  setHasUnsavedChanges: (v: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,

  setWorkspaces: (workspaces) => set({ workspaces }),
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [workspace as WorkspaceListItem, ...state.workspaces] })),
  removeWorkspace: (id) =>
    set((state) => ({ workspaces: state.workspaces.filter((w) => w._id !== id) })),
  updateWorkspaceInList: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w._id === id ? { ...w, ...updates } : w
      ),
    })),

  setCurrentWorkspace: (workspace) =>
    set({ currentWorkspace: workspace, hasUnsavedChanges: false }),
  updateCanvasData: (canvasData) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, canvasData }
        : null,
      hasUnsavedChanges: true,
    })),
  updateMarkdown: (markdownText) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, markdownText }
        : null,
      hasUnsavedChanges: true,
    })),
  updateTitle: (title) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, title }
        : null,
      hasUnsavedChanges: true,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (lastSaved) => set({ lastSaved, hasUnsavedChanges: false }),
  setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
}));

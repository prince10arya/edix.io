'use client';
import { create } from 'zustand';

type PanelMode = 'split' | 'canvas-only' | 'editor-only';

interface UiStore {
  theme: 'dark' | 'light';
  commandPaletteOpen: boolean;
  aiPanelOpen: boolean;
  sidebarOpen: boolean;
  panelMode: PanelMode;
  isExportMenuOpen: boolean;
  isCodeUploadOpen: boolean;

  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleAiPanel: () => void;
  setAiPanelOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setPanelMode: (mode: PanelMode) => void;
  setExportMenuOpen: (v: boolean) => void;
  setCodeUploadOpen: (v: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  theme: 'dark',
  commandPaletteOpen: false,
  aiPanelOpen: false,
  sidebarOpen: true,
  panelMode: 'split',
  isExportMenuOpen: false,
  isCodeUploadOpen: false,

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setAiPanelOpen: (aiPanelOpen) => set({ aiPanelOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPanelMode: (panelMode) => set({ panelMode }),
  setExportMenuOpen: (isExportMenuOpen) => set({ isExportMenuOpen }),
  setCodeUploadOpen: (isCodeUploadOpen) => set({ isCodeUploadOpen }),
}));

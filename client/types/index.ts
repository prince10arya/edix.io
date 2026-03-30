// ============================================================
// SHARED TYPESCRIPT TYPES
// ============================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface CanvasNode {
  id: string;
  type: 'service' | 'database' | 'queue' | 'api' | 'client' | 'gateway' | 'storage' | 'generic';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  props?: Record<string, unknown>;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

export interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  tlDrawData?: Record<string, unknown>;
}

export interface Workspace {
  _id: string;
  title: string;
  description?: string;
  canvasData: CanvasData;
  markdownText: string;
  tags: string[];
  thumbnail?: string;
  createdBy: string | User;
  isPublic: boolean;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceListItem extends Omit<Workspace, 'canvasData'> {
  canvasData: Omit<CanvasData, 'tlDrawData'>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; field: string }>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DiagramGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface WorkspaceState {
  workspaces: WorkspaceListItem[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

// Command palette action
export interface CommandAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  group?: string;
}

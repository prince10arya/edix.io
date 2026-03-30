import api from './api';
import { ApiResponse, Workspace, WorkspaceListItem, CanvasData, PaginatedResponse } from '@/types';

export const workspaceService = {
  async getAll(page = 1, limit = 20): Promise<{ data: WorkspaceListItem[]; pagination: PaginatedResponse<WorkspaceListItem>['pagination'] }> {
    const { data } = await api.get<PaginatedResponse<WorkspaceListItem>>('/workspaces', {
      params: { page, limit },
    });
    if (!data.success) throw new Error(data.message || 'Failed to fetch workspaces');
    return { data: data.data || [], pagination: data.pagination };
  },

  async getById(id: string): Promise<Workspace> {
    const { data } = await api.get<ApiResponse<Workspace>>(`/workspaces/${id}`);
    if (!data.success || !data.data) throw new Error(data.message || 'Workspace not found');
    return data.data;
  },

  async getByShareId(shareId: string): Promise<Workspace> {
    const { data } = await api.get<ApiResponse<Workspace>>(`/workspaces/share/${shareId}`);
    if (!data.success || !data.data) throw new Error(data.message || 'Shared workspace not found');
    return data.data;
  },

  async create(title?: string, description?: string): Promise<Workspace> {
    const { data } = await api.post<ApiResponse<Workspace>>('/workspaces', {
      title: title || 'Untitled Workspace',
      description,
    });
    if (!data.success || !data.data) throw new Error(data.message || 'Failed to create workspace');
    return data.data;
  },

  async update(
    id: string,
    updates: {
      title?: string;
      description?: string;
      canvasData?: CanvasData;
      markdownText?: string;
      tags?: string[];
      thumbnail?: string;
    }
  ): Promise<Workspace> {
    const { data } = await api.put<ApiResponse<Workspace>>(`/workspaces/${id}`, updates);
    if (!data.success || !data.data) throw new Error(data.message || 'Failed to save workspace');
    return data.data;
  },

  async delete(id: string): Promise<void> {
    const { data } = await api.delete<ApiResponse>(`/workspaces/${id}`);
    if (!data.success) throw new Error(data.message || 'Failed to delete workspace');
  },

  async toggleShare(id: string): Promise<{ isPublic: boolean; shareId?: string; shareUrl?: string }> {
    const { data } = await api.post<ApiResponse<{ isPublic: boolean; shareId?: string; shareUrl?: string }>>(
      `/workspaces/${id}/share`
    );
    if (!data.success || !data.data) throw new Error(data.message || 'Failed to toggle share');
    return data.data;
  },
};

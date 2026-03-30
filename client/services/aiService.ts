import api from './api';
import { ApiResponse, DiagramGraph } from '@/types';

export const aiService = {
  async generateFromPrompt(prompt: string): Promise<DiagramGraph> {
    const { data } = await api.post<ApiResponse<DiagramGraph>>('/ai/generate', { prompt });
    if (!data.success || !data.data) throw new Error(data.message || 'AI generation failed');
    return data.data;
  },

  async generateFromMarkdown(markdown: string): Promise<DiagramGraph> {
    const { data } = await api.post<ApiResponse<DiagramGraph>>('/ai/from-markdown', { markdown });
    if (!data.success || !data.data) throw new Error(data.message || 'Markdown diagram generation failed');
    return data.data;
  },

  async generateFromCodebase(
    file: File
  ): Promise<{ diagram: DiagramGraph; meta: { projectType: string; filesAnalyzed: number; projectName: string } }> {
    const formData = new FormData();
    formData.append('codebase', file);

    const { data } = await api.post<
      ApiResponse<DiagramGraph> & {
        meta: { projectType: string; filesAnalyzed: number; projectName: string };
      }
    >('/ai/upload-code', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for large ZIP
    });

    if (!data.success || !data.data) throw new Error(data.message || 'Codebase analysis failed');
    return { diagram: data.data, meta: data.meta };
  },
};

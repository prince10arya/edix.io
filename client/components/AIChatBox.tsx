'use client';

import React, { useState } from 'react';
import { Sparkles, Code2, Upload, MessageSquareText, FileArchive, X } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';

export default function AIChatBox() {
  const { aiPanelOpen, toggleAiPanel } = useUiStore();
  const { currentWorkspace, updateCanvasData } = useWorkspaceStore();
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'prompt' | 'markdown' | 'codebase'>('prompt');
  
  if (!aiPanelOpen || !currentWorkspace) return null;

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || prompt.length < 5) return toast.error('Please enter a descriptive prompt');
    
    setLoading(true);
    try {
      const graph = await aiService.generateFromPrompt(prompt);
      
      // Merge with existing vs overwrite? For MVP, we'll replace the canvas for simplicity
      // but preserve the raw tldraw store if possible
      updateCanvasData({
        nodes: graph.nodes,
        edges: graph.edges,
        tlDrawData: { ...currentWorkspace.canvasData.tlDrawData } as Record<string, unknown>
      });
      
      toast.success('Architecture generated!');
      setPrompt('');
      toggleAiPanel();
    } catch (error: any) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownSubmit = async () => {
    if (!currentWorkspace.markdownText || currentWorkspace.markdownText.length < 20) {
      return toast.error('Notes are too short to generate a diagram');
    }
    
    setLoading(true);
    try {
      const graph = await aiService.generateFromMarkdown(currentWorkspace.markdownText);
      updateCanvasData({
        nodes: graph.nodes,
        edges: graph.edges,
        tlDrawData: { ...currentWorkspace.canvasData.tlDrawData } as Record<string, unknown>
      });
      toast.success('Generated from notes!');
      toggleAiPanel();
    } catch (error: any) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCodebaseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) return toast.error('Only ZIP files are supported');
    if (file.size > 50 * 1024 * 1024) return toast.error('File size must be less than 50MB');

    setLoading(true);
    try {
      const { diagram, meta } = await aiService.generateFromCodebase(file);
      updateCanvasData({
        nodes: diagram.nodes,
        edges: diagram.edges,
        tlDrawData: { ...currentWorkspace.canvasData.tlDrawData } as Record<string, unknown>
      });
      toast.success(`Analyzed ${meta.filesAnalyzed} files in ${meta.projectName}`);
      toggleAiPanel();
    } catch (error: any) {
      toast.error(error.message || 'Codebase analysis failed');
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="absolute top-16 right-4 w-[400px] bg-dark-surface border border-dark-border rounded-xl shadow-2xl z-50 flex flex-col animate-slide-in overflow-hidden">
      <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-elevated">
        <div className="flex items-center gap-2 text-brand-400 font-semibold">
          <Sparkles size={18} />
          AI Architect
        </div>
        <button onClick={toggleAiPanel} className="text-dark-subtle hover:text-white p-1 rounded-md hover:bg-dark-bg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex p-2 bg-dark-bg border-b border-dark-border gap-1">
        <button
          onClick={() => setMode('prompt')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'prompt' ? 'bg-brand-600/20 text-brand-400' : 'text-dark-subtle hover:text-white'}`}
        >
           <MessageSquareText size={14} className="inline mr-1.5 mb-0.5" /> Prompt
        </button>
        <button
          onClick={() => setMode('markdown')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'markdown' ? 'bg-brand-600/20 text-brand-400' : 'text-dark-subtle hover:text-white'}`}
        >
           <Code2 size={14} className="inline mr-1.5 mb-0.5" /> Notes
        </button>
        <button
          onClick={() => setMode('codebase')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'codebase' ? 'bg-brand-600/20 text-brand-400' : 'text-dark-subtle hover:text-white'}`}
        >
           <Upload size={14} className="inline mr-1.5 mb-0.5" /> Code
        </button>
      </div>

      <div className="p-4">
        {mode === 'prompt' && (
          <form onSubmit={handlePromptSubmit} className="flex flex-col gap-3">
            <p className="text-xs text-dark-subtle">
              Describe your architecture in plain English. For example: "A microservices e-commerce system with an API gateway, auth, and payment services."
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-brand-500 min-h-[100px] resize-none"
              placeholder="Design an architecture for..."
            />
            <button disabled={loading} type="submit" className="btn-primary justify-center">
              {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : 'Generate Diagram'}
            </button>
          </form>
        )}

        {mode === 'markdown' && (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400 border border-blue-500/20">
              <Code2 size={24} />
            </div>
            <p className="text-sm text-dark-subtle">
              The AI will read your current notes in the left panel and attempt to visualize the architecture it describes.
            </p>
            <button disabled={loading} onClick={handleMarkdownSubmit} className="btn-primary justify-center w-full">
               {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : 'Visualize Notes'}
            </button>
          </div>
        )}

        {mode === 'codebase' && (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
              <FileArchive size={24} />
            </div>
            <p className="text-sm text-dark-subtle">
              Upload a .zip file of your backend source code. The AI will parse your controllers, services, and models to reverse-engineer the architecture.
              <br/><span className="text-xs text-dark-muted mt-2 block">Supports: Express, Spring Boot, Django, Go. Max 50MB.</span>
            </p>
            <label className={`btn-primary justify-center cursor-pointer w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <Upload size={16} className="mr-2" /> Upload .ZIP
                </>
              )}
              <input type="file" accept=".zip,application/zip" className="hidden" onChange={handleCodebaseUpload} disabled={loading} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

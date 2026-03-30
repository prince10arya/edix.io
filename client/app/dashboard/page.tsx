'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Clock, MoreVertical, Trash2, Edit2, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { workspaceService } from '@/services/workspaceService';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { workspaces, setWorkspaces, addWorkspace, removeWorkspace } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchWorkspaces = async () => {
      try {
        const { data } = await workspaceService.getAll(1, 50);
        if (mounted) {
          setWorkspaces(data);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          toast.error('Failed to load workspaces');
          setLoading(false);
        }
      }
    };

    fetchWorkspaces();
    return () => { mounted = false; };
  }, [setWorkspaces]);

  const handleCreateNew = async () => {
    setCreating(true);
    try {
      const workspace = await workspaceService.create('Untitled Workspace', '');
      addWorkspace(workspace as any);
      router.push(`/workspace/${workspace._id}`);
    } catch (error) {
      toast.error('Failed to create workspace');
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this workspace?')) {
      try {
        await workspaceService.delete(id);
        removeWorkspace(id);
        toast.success('Workspace deleted');
      } catch (error) {
        toast.error('Failed to delete workspace');
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Workspaces</h1>
          <p className="text-dark-subtle">Manage your architectures and technical designs.</p>
        </div>
        <button
          onClick={handleCreateNew}
          disabled={creating}
          className="btn-primary"
        >
          {creating ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          New Workspace
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-48 w-full card border-transparent" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 card border-dashed border-dark-border/60 bg-dark-bg/50">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
            <Plus className="text-brand-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
          <p className="text-dark-subtle mb-6 text-center max-w-md">
            Create your first workspace to start drawing diagrams and writing technical specs.
          </p>
          <button onClick={handleCreateNew} className="btn-primary">
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workspaces.map((workspace) => (
            <Link
              key={workspace._id}
              href={`/workspace/${workspace._id}`}
              className="group card-hover p-5 flex flex-col h-48 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-colors">
                  <svg className="w-5 h-5 text-dark-subtle group-hover:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                
                <div className="relative group/menu">
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-1 rounded-md text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors">
                    <MoreVertical size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-36 bg-dark-elevated border border-dark-border rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1">
                    <button onClick={(e) => handleDelete(e, workspace._id)} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-white truncate text-lg group-hover:text-brand-300 transition-colors">
                {workspace.title}
              </h3>
              
              <p className="text-dark-subtle text-sm mt-2 line-clamp-2 leading-relaxed flex-1">
                {workspace.description || 'No description provided.'}
              </p>

              <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between text-xs text-dark-subtle">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true })}
                </span>
                {workspace.isPublic && (
                  <span className="tag bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Public</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

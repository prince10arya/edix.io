'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, CheckSquare, Code, Quote } from 'lucide-react';

export default function MarkdownEditor() {
  const { currentWorkspace, updateMarkdown } = useWorkspaceStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing architecture specifications...' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: currentWorkspace?.markdownText || '',
    onUpdate: ({ editor }) => {
      // Get the markdown (or HTML since TipTap StarterKit produces HTML)
      // For MVP, we'll store HTML as string and render it 
      const html = editor.getHTML();
      updateMarkdown(html);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content',
      },
    },
  });

  // Sync content if workspace changes (e.g. initial load)
  useEffect(() => {
    if (editor && currentWorkspace?.markdownText && editor.getHTML() !== currentWorkspace.markdownText) {
      editor.commands.setContent(currentWorkspace.markdownText);
    }
  }, [editor, currentWorkspace?.markdownText]);

  if (!editor || !currentWorkspace) return null;

  return (
    <div className="w-full h-full flex flex-col bg-dark-bg/80 border border-dark-border rounded-lg overflow-hidden glass">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-dark-border bg-dark-surface/50 sticky top-0 z-10">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('bold') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('italic') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Italic size={16} />
        </button>
        
        <div className="w-px h-4 bg-dark-border mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Heading2 size={16} />
        </button>

        <div className="w-px h-4 bg-dark-border mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('bulletList') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('orderedList') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('taskList') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <CheckSquare size={16} />
        </button>

        <div className="w-px h-4 bg-dark-border mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('codeBlock') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-dark-subtle hover:text-white hover:bg-dark-elevated transition-colors ${editor.isActive('blockquote') ? 'bg-dark-elevated text-brand-400' : ''}`}
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto custom-scrollbar">
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
}

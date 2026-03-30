import mongoose, { Document, Schema } from 'mongoose';

export interface ICanvasNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  props?: Record<string, unknown>;
}

export interface ICanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ICanvasData {
  nodes: ICanvasNode[];
  edges: ICanvasEdge[];
  tlDrawData?: Record<string, unknown>; // raw tldraw snapshot
}

export interface IWorkspace extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  canvasData: ICanvasData;
  markdownText: string;
  tags: string[];
  thumbnail?: string;
  createdBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  shareId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CanvasNodeSchema = new Schema<ICanvasNode>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 120 },
    height: { type: Number, default: 60 },
    label: { type: String },
    props: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const CanvasEdgeSchema = new Schema<ICanvasEdge>(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    label: { type: String },
  },
  { _id: false }
);

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    title: {
      type: String,
      required: [true, 'Workspace title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Untitled Workspace',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    canvasData: {
      type: {
        nodes: [CanvasNodeSchema],
        edges: [CanvasEdgeSchema],
        tlDrawData: { type: Schema.Types.Mixed },
      },
      default: { nodes: [], edges: [], tlDrawData: {} },
    },
    markdownText: {
      type: String,
      default: '# Welcome to Mini Eraser\n\nStart writing your notes here...',
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user workspace lookup
WorkspaceSchema.index({ createdBy: 1, updatedAt: -1 });

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

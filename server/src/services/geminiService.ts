import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

export interface DiagramNode {
  id: string;
  type: 'service' | 'database' | 'queue' | 'api' | 'client' | 'gateway' | 'storage' | 'generic';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

export interface DiagramGraph {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Helper: ensure all IDs are unique
function ensureUniqueIds(graph: DiagramGraph): DiagramGraph {
  const nodeIds = new Set<string>();
  const nodes = (graph.nodes || []).map((node, i) => {
    if (!node.id || nodeIds.has(node.id)) {
      node.id = `node-${Date.now()}-${i}`;
    }
    nodeIds.add(node.id);
    return node;
  });

  const edgeIds = new Set<string>();
  const edges = (graph.edges || []).map((edge, i) => {
    if (!edge.id || edgeIds.has(edge.id)) {
      edge.id = `edge-${Date.now()}-${i}`;
    }
    edgeIds.add(edge.id);
    return edge;
  });

  return { nodes, edges };
}

// =====================================================================
// PROMPT → DIAGRAM
// =====================================================================
const DIAGRAM_SYSTEM_PROMPT = `You are an expert software architect. Your task is to generate architecture diagrams as JSON.

Given a description, return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "service|database|queue|api|client|gateway|storage|generic",
      "label": "Display Name",
      "x": <number 0-1200>,
      "y": <number 0-800>,
      "width": 140,
      "height": 60
    }
  ],
  "edges": [
    {
      "id": "edge-uid",
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "optional label",
      "style": "solid|dashed"
    }
  ]
}

Layout rules:
- Use a left-to-right or top-down layout
- Clients go top-left (x=50, y=50-100)
- API Gateway goes middle-top (x=300, y=150)
- Services spread across middle (y=300)
- Databases go bottom (y=500)
- Queues go between services (y=350)
- Space nodes at least 180px apart horizontally
- Include meaningful connection labels (REST, gRPC, SQL, pub/sub, etc.)`;

export const generateDiagramFromPrompt = async (
  prompt: string
): Promise<DiagramGraph> => {
  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: `Generate an architecture diagram for: ${prompt}`,
    config: {
      systemInstruction: DIAGRAM_SYSTEM_PROMPT,
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const content = response.text;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content) as DiagramGraph;
  return ensureUniqueIds(parsed);
};

// =====================================================================
// MARKDOWN → DIAGRAM
// =====================================================================
const MARKDOWN_DIAGRAM_PROMPT = `You are an expert software architect. Analyze this product requirements document and extract the architecture.

Return ONLY valid JSON in this exact format:
{
  "nodes": [...],
  "edges": [...]
}

Each node should have: id, type (service|database|queue|api|client|gateway|storage|generic), label, x, y, width (140), height (60)
Each edge should have: id, source, target, label, style (solid|dashed)

Focus on extracting: services, APIs, databases, queues, auth flows, external integrations.
Space nodes properly: clients (top), APIs (upper-middle), services (middle), databases/queues (bottom).`;

export const generateDiagramFromMarkdown = async (
  markdown: string
): Promise<DiagramGraph> => {
  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: `Analyze this requirements document and generate an architecture diagram:\n\n${markdown}`,
    config: {
      systemInstruction: MARKDOWN_DIAGRAM_PROMPT,
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const content = response.text;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content) as DiagramGraph;
  return ensureUniqueIds(parsed);
};

// =====================================================================
// CODEBASE SUMMARY → DIAGRAM
// =====================================================================
const CODEBASE_DIAGRAM_PROMPT = `You are a senior software architect analyzing backend codebase structure.

Given a summary of files, controllers, services, models, and routes from a codebase, generate an architecture diagram.

Return ONLY valid JSON in this exact format:
{
  "nodes": [...],
  "edges": [...]
}

Each node: id, type (service|database|queue|api|client|gateway|storage|generic), label, x, y, width (140), height (60)
Each edge: id, source, target, label, style (solid|dashed)

Focus on:
- REST API routes → controllers
- Controllers → services
- Services → models/repositories
- Models → database
- External integrations`;

export const generateDiagramFromCodeSummary = async (
  codeSummary: string
): Promise<DiagramGraph> => {
  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: `Analyze this codebase and generate an architecture diagram:\n\n${codeSummary}`,
    config: {
      systemInstruction: CODEBASE_DIAGRAM_PROMPT,
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const content = response.text;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content) as DiagramGraph;
  return ensureUniqueIds(parsed);
};

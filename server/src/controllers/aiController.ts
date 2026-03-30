import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  generateDiagramFromPrompt,
  generateDiagramFromMarkdown,
  generateDiagramFromCodeSummary,
} from '../services/geminiService';
import { parseZipFile } from '../utils/codeParser';
import fs from 'fs';

// @route   POST /api/ai/generate
// @access  Private
export const generateFromPrompt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      res.status(400).json({ success: false, message: 'A valid prompt is required (min 5 chars).' });
      return;
    }

    const diagram = await generateDiagramFromPrompt(prompt.trim());

    res.status(200).json({
      success: true,
      message: 'Diagram generated successfully.',
      data: diagram,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/from-markdown
// @access  Private
export const generateFromMarkdown = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { markdown } = req.body;
    if (!markdown || typeof markdown !== 'string' || markdown.trim().length < 20) {
      res.status(400).json({ success: false, message: 'Markdown content is too short.' });
      return;
    }

    const diagram = await generateDiagramFromMarkdown(markdown.trim());

    res.status(200).json({
      success: true,
      message: 'Diagram generated from markdown.',
      data: diagram,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/upload-code
// @access  Private
export const generateFromCodebase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'ZIP file is required.' });
      return;
    }

    const zipPath = req.file.path;

    // Parse the ZIP
    const codebaseStructure = await parseZipFile(zipPath);

    // Clean up the uploaded file
    fs.unlink(zipPath, () => {});

    if (codebaseStructure.files.length === 0) {
      res.status(422).json({
        success: false,
        message: 'No recognizable source files found in ZIP. Supported: .ts, .js, .java, .py, .go, .cs, .rb',
      });
      return;
    }

    // Generate diagram from code summary via OpenAI
    const diagram = await generateDiagramFromCodeSummary(codebaseStructure.summary);

    res.status(200).json({
      success: true,
      message: `Architecture diagram generated for ${codebaseStructure.type} project.`,
      data: diagram,
      meta: {
        projectType: codebaseStructure.type,
        filesAnalyzed: codebaseStructure.files.length,
        projectName: codebaseStructure.projectName,
      },
    });
  } catch (error) {
    // Clean up file on error
    if ((req as AuthRequest & { file?: Express.Multer.File }).file?.path) {
      fs.unlink((req as AuthRequest & { file?: Express.Multer.File }).file!.path, () => {});
    }
    next(error);
  }
};

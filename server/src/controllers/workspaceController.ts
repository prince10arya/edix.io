import { Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import Workspace from '../models/Workspace';
import { AuthRequest } from '../middleware/auth';

// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [workspaces, total] = await Promise.all([
      Workspace.find({ createdBy: req.user!._id })
        .select('-canvasData.tlDrawData') // exclude heavy tlDraw raw data in list
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Workspace.countDocuments({ createdBy: req.user!._id }),
    ]);

    res.status(200).json({
      success: true,
      data: workspaces,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspaceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      createdBy: req.user!._id,
    });

    if (!workspace) {
      res.status(404).json({ success: false, message: 'Workspace not found.' });
      return;
    }

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/workspaces/share/:shareId
// @access  Public
export const getWorkspaceByShareId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspace = await Workspace.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    }).populate('createdBy', 'name avatar');

    if (!workspace) {
      res.status(404).json({ success: false, message: 'Shared workspace not found.' });
      return;
    }

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, tags } = req.body;

    const workspace = await Workspace.create({
      title: title || 'Untitled Workspace',
      description,
      tags,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully.',
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/workspaces/:id
// @access  Private
export const updateWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, canvasData, markdownText, tags, thumbnail } = req.body;

    const workspace = await Workspace.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user!._id },
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(canvasData !== undefined && { canvasData }),
          ...(markdownText !== undefined && { markdownText }),
          ...(tags !== undefined && { tags }),
          ...(thumbnail !== undefined && { thumbnail }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!workspace) {
      res.status(404).json({ success: false, message: 'Workspace not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Workspace saved.',
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/workspaces/:id
// @access  Private
export const deleteWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user!._id,
    });

    if (!workspace) {
      res.status(404).json({ success: false, message: 'Workspace not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Workspace deleted.' });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/workspaces/:id/share
// @access  Private
export const toggleShare = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      createdBy: req.user!._id,
    });

    if (!workspace) {
      res.status(404).json({ success: false, message: 'Workspace not found.' });
      return;
    }

    if (workspace.isPublic) {
      workspace.isPublic = false;
      workspace.shareId = undefined;
    } else {
      workspace.isPublic = true;
      workspace.shareId = nanoid(10);
    }

    await workspace.save();

    res.status(200).json({
      success: true,
      data: {
        isPublic: workspace.isPublic,
        shareId: workspace.shareId,
        shareUrl: workspace.shareId
          ? `${process.env.CLIENT_URL}/share/${workspace.shareId}`
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

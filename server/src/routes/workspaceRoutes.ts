import { Router } from 'express';
import {
  getWorkspaces,
  getWorkspaceById,
  getWorkspaceByShareId,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  toggleShare,
} from '../controllers/workspaceController';
import { protect } from '../middleware/auth';

const router = Router();

// Public route - shared workspace
router.get('/share/:shareId', getWorkspaceByShareId);

// Protected routes
router.use(protect);

router.route('/').get(getWorkspaces).post(createWorkspace);

router
  .route('/:id')
  .get(getWorkspaceById)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

router.post('/:id/share', toggleShare);

export default router;

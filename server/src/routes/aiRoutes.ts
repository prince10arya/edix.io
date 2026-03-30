import { Router } from 'express';
import { generateFromPrompt, generateFromMarkdown, generateFromCodebase } from '../controllers/aiController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(protect);

router.post('/generate', generateFromPrompt);
router.post('/from-markdown', generateFromMarkdown);
router.post('/upload-code', upload.single('codebase'), generateFromCodebase);

export default router;

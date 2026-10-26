import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, ProgressController.getMyProgress);
router.get('/courses/:courseId', authenticate, ProgressController.getCourseProgress);

export default router;

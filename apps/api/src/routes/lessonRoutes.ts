import { Router } from 'express';
import { LessonController } from '../controllers/lessonController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/:id', authenticate, LessonController.getLessonById);
router.post('/:id/complete', authenticate, LessonController.completeLesson);

// Admin
router.post('/', authenticate, requireRole(['admin', 'superadmin']), LessonController.createLesson);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), LessonController.updateLesson);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), LessonController.deleteLesson);

export default router;

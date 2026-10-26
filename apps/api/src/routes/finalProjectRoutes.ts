import { Router } from 'express';
import { FinalProjectController } from '../controllers/finalProjectController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/submit', authenticate, FinalProjectController.submitProject);
router.get('/me', authenticate, FinalProjectController.getMySubmission);
router.patch('/:id/review', authenticate, requireRole(['admin', 'superadmin', 'instructor']), FinalProjectController.adminReview);

export default router;

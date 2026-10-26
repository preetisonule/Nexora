import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/:id', authenticate, AssignmentController.getAssignmentById);
router.post('/run', authenticate, AssignmentController.runCode);
router.post('/:id/submit', authenticate, AssignmentController.submitSolution);
router.get('/:id/submissions', authenticate, AssignmentController.getSubmissions);

// Admin
router.post('/', authenticate, requireRole(['admin', 'superadmin']), AssignmentController.createAssignment);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), AssignmentController.updateAssignment);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), AssignmentController.deleteAssignment);
router.post('/test-cases', authenticate, requireRole(['admin', 'superadmin']), AssignmentController.addTestCase);
router.delete('/test-cases/:id', authenticate, requireRole(['admin', 'superadmin']), AssignmentController.deleteTestCase);

export default router;

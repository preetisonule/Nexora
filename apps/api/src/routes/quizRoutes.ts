import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/:id', authenticate, QuizController.getQuizById);
router.post('/:id/attempts', authenticate, QuizController.submitAttempt);
router.get('/attempts/:id/results', authenticate, QuizController.getAttemptResults);

// Admin
router.post('/', authenticate, requireRole(['admin', 'superadmin']), QuizController.createQuiz);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), QuizController.updateQuiz);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), QuizController.deleteQuiz);
router.post('/questions', authenticate, requireRole(['admin', 'superadmin']), QuizController.addQuestion);
router.patch('/questions/:id', authenticate, requireRole(['admin', 'superadmin']), QuizController.updateQuestion);
router.delete('/questions/:id', authenticate, requireRole(['admin', 'superadmin']), QuizController.deleteQuestion);

export default router;

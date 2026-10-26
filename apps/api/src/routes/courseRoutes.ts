import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/:slug', CourseController.getCourseBySlug);
router.post('/', authenticate, requireRole(['admin', 'superadmin']), CourseController.createCourse);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), CourseController.updateCourse);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), CourseController.deleteCourse);

export default router;

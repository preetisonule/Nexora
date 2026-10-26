import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', optionalAuth, CourseController.getAllCourses);
router.get('/:slug', optionalAuth, CourseController.getCourseBySlug);
router.post('/', authenticate, requireRole(['admin', 'superadmin']), CourseController.createCourse);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), CourseController.updateCourse);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), CourseController.deleteCourse);

export default router;

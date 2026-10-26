import { Router } from 'express';
import { ModuleController } from '../controllers/moduleController';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Optional authentication: logged-in users also get their unlock / progress state
router.get('/', optionalAuth, ModuleController.getModules);
router.get('/:id', optionalAuth, ModuleController.getModuleById);

router.post('/', authenticate, requireRole(['admin', 'superadmin']), ModuleController.createModule);
router.patch('/reorder', authenticate, requireRole(['admin', 'superadmin']), ModuleController.reorderModules);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), ModuleController.updateModule);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), ModuleController.deleteModule);

export default router;

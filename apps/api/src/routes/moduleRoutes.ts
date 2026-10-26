import { Router } from 'express';
import { ModuleController } from '../controllers/moduleController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Optional authentication to calculate unlock states for logged in users
router.get('/', (req, res, next) => {
  authenticate(req, res, () => {
    ModuleController.getModules(req, res);
  }).catch(() => ModuleController.getModules(req, res));
});

router.get('/:id', (req, res, next) => {
  authenticate(req, res, () => {
    ModuleController.getModuleById(req, res);
  }).catch(() => ModuleController.getModuleById(req, res));
});

router.post('/', authenticate, requireRole(['admin', 'superadmin']), ModuleController.createModule);
router.patch('/reorder', authenticate, requireRole(['admin', 'superadmin']), ModuleController.reorderModules);
router.patch('/:id', authenticate, requireRole(['admin', 'superadmin']), ModuleController.updateModule);
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), ModuleController.deleteModule);

export default router;

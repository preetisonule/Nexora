import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// All routes here require admin or superadmin
router.use(authenticate, requireRole(['admin', 'superadmin']));

router.get('/metrics', AdminController.getDashboardMetrics);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.patch('/users/:id/status', AdminController.toggleUserStatus);
router.get('/certificates', AdminController.getCertificates);
router.patch('/certificates/:id/revoke', AdminController.revokeCertificate);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;

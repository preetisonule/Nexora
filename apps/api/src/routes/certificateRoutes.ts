import { Router } from 'express';
import { CertificateController } from '../controllers/certificateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public verification endpoint
router.get('/:certificateId/verify', CertificateController.verifyCertificate);

// Protected learner endpoints
router.get('/me', authenticate, CertificateController.getMyCertificates);
router.post('/claim', authenticate, CertificateController.claimCertificate);
router.get('/:certificateId', CertificateController.getCertificateById);

export default router;

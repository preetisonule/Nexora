import { Request, Response } from 'express';
import { Certificate } from '../models/Certificate';
import { Course } from '../models/Course';
import { CertificateService } from '../services/certificateService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class CertificateController {
  public static async getMyCertificates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      const certificates = await Certificate.find({ learnerId, status: 'valid' }).sort({
        issueDate: -1,
      });

      res.json({ success: true, data: certificates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getCertificateById(req: Request, res: Response): Promise<void> {
    try {
      const { certificateId } = req.params;
      const certificate = await Certificate.findOne({ certificateId });

      if (!certificate) {
        res.status(404).json({ success: false, error: 'Certificate not found' });
        return;
      }

      res.json({ success: true, data: certificate });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async claimCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const defaultCourse = await Course.findOne({ published: true });
      if (!defaultCourse) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      const certificate = await CertificateService.issueCertificate(
        learnerId.toString(),
        defaultCourse._id.toString()
      );

      res.status(201).json({
        success: true,
        message: 'Congratulations! Your certificate has been issued.',
        data: certificate,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  public static async verifyCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { certificateId } = req.params;
      const result = await CertificateService.verifyCertificate(certificateId);

      if (!result.valid && !result.certificate) {
        res.status(404).json({
          success: false,
          valid: false,
          message: 'Certificate not found or invalid certificate ID.',
        });
        return;
      }

      res.json({
        success: true,
        valid: result.valid,
        data: result.certificate,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

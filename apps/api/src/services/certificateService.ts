import crypto from 'crypto';
import QRCode from 'qrcode';
import { Certificate, ICertificateDocument } from '../models/Certificate';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { ProgressService } from './progressService';
import { config } from '../config';

export class CertificateService {
  public static async issueCertificate(
    learnerId: string,
    courseId: string
  ): Promise<ICertificateDocument> {
    // 1. Check if certificate already exists
    const existing = await Certificate.findOne({ learnerId, courseId });
    if (existing?.status === 'valid') {
      return existing;
    }
    if (existing?.status === 'revoked') {
      throw new Error('Your certificate for this course was revoked. Please contact an administrator.');
    }

    // 2. Validate eligibility
    const eligibility = await ProgressService.checkCertificateEligibility(learnerId, courseId);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason || 'Learner is not eligible for certificate yet');
    }

    const learner = await User.findById(learnerId);
    const course = await Course.findById(courseId);

    if (!learner || !course) {
      throw new Error('Learner or course not found');
    }

    // 3. Generate unique unguessable certificate ID & token
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const certificateId = `COMPILO-GO-2026-${randomHex}`;
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const verificationUrl = `${config.frontendUrl}/verify/${certificateId}`;

    // 4. Generate digital QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 256,
      color: {
        dark: '#5B21B6',
        light: '#FFFFFF',
      },
    });

    const cert = await Certificate.create({
      certificateId,
      learnerId: learner._id,
      learnerName: learner.name,
      courseId: course._id,
      courseTitle: course.title,
      courseLevel: course.level,
      issueDate: new Date(),
      status: 'valid',
      verificationUrl,
      verificationToken,
      qrCodeDataUrl,
    });

    return cert;
  }

  public static async verifyCertificate(certificateId: string): Promise<{
    valid: boolean;
    certificate?: {
      certificateId: string;
      learnerName: string;
      courseTitle: string;
      courseLevel: string;
      issueDate: Date;
      status: 'valid' | 'revoked';
      revocationReason?: string;
    };
  }> {
    const cert = await Certificate.findOne({ certificateId });
    if (!cert) {
      return { valid: false };
    }

    return {
      valid: cert.status === 'valid',
      certificate: {
        certificateId: cert.certificateId,
        learnerName: cert.learnerName,
        courseTitle: cert.courseTitle,
        courseLevel: cert.courseLevel,
        issueDate: cert.issueDate,
        status: cert.status,
        revocationReason: cert.revocationReason,
      },
    };
  }
}

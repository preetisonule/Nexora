import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  Award,
  Download,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const CertificateViewPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const { success, error } = useToast();

  useEffect(() => {
    ApiClient.get<any>(`/certificates/${certificateId}`)
      .then(setCert)
      .catch((err) => error(err.message || 'Certificate not found'))
      .finally(() => setLoading(false));
  }, [certificateId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Verification link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Nexora-Certificate-${cert?.certificateId || 'Go'}.pdf`);
      success('Certificate PDF generated and downloaded!');
    } catch (err: any) {
      error('Failed to generate PDF. You can also print the page directly.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading || !cert) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Certificates', path: '/certificates' },
          { label: cert.certificateId },
        ]}
      />

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Official Course Certificate
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Issued to {cert.learnerName} for completing {cert.courseTitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-subtle transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Link
          </button>

          <Link
            to={`/verify/${cert.certificateId}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-subtle transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Verification Page
          </Link>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-elevated transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="overflow-x-auto pb-4">
        <div
          ref={certRef}
          className="min-w-[800px] w-full bg-white text-slate-900 rounded-3xl p-12 sm:p-16 border-8 border-slate-100 shadow-2xl relative space-y-8 overflow-hidden"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Subtle Guilloche border / corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-50 rounded-br-full -z-0 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-50 rounded-tl-full -z-0 pointer-events-none" />

          {/* Top Logo & Credential Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center">
                NX
              </div>
              <div>
                <h2 className="font-extrabold text-lg tracking-tight text-slate-900">
                  Nexora <span className="text-slate-400 font-normal">Learn</span>
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-600">
                  Verified Credential Standard
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Certificate ID
              </span>
              <p className="font-mono text-xs font-bold text-slate-800">{cert.certificateId}</p>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="relative z-10 text-center space-y-3 py-4">
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Certificate of Completion
            </p>
            <p className="text-xs text-slate-500">This is to certify that</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-brand-500/40 underline-offset-8">
              {cert.learnerName}
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto pt-2 leading-relaxed">
              has successfully fulfilled all curriculum requirements, interactive assessments, coding challenges, and capstone project for
            </p>
            <h4 className="text-xl font-bold text-brand-700 tracking-tight">
              {cert.courseTitle}
            </h4>
            <p className="text-xs text-slate-500">
              Level: {cert.courseLevel || 'Beginner to Intermediate'} • 10 Modules • 60 Lessons
            </p>
          </div>

          {/* Bottom Verification & Signatures */}
          <div className="relative z-10 pt-8 border-t border-slate-200 flex items-center justify-between gap-6 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Comp!lo Learn Verification Council</p>
              <p className="text-[11px] text-slate-400">
                Issued on: {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified Record
              </div>
            </div>

            {/* QR Code */}
            {cert.qrCodeDataUrl ? (
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={cert.qrCodeDataUrl}
                  alt="Certificate Verification QR Code"
                  className="w-16 h-16 rounded-lg"
                />
                <div className="text-[10px] text-slate-500 max-w-[120px] leading-tight">
                  Scan to verify online authenticity
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  QrCode,
  Calendar,
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const [certs, prog, project] = await Promise.all([
        ApiClient.get<any[]>('/certificates/me'),
        ApiClient.get<any>('/progress/me'),
        ApiClient.get<any>('/projects/me').catch(() => null),
      ]);
      setCertificates(certs || []);
      setProgress(prog);
      setProjectStatus(project?.status || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      const newCert = await ApiClient.post<any>('/certificates/claim');
      success('Congratulations! Your verified certificate has been issued.');
      loadData();
    } catch (err: any) {
      error(err.message || 'Certificate eligibility requirements not met yet.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const isEligible = progress?.certificateEligible;
  const modulesDone = progress?.completedModulesCount || 0;
  const totalModules = progress?.totalModulesCount || 10;
  const testsPassed = (progress?.modulesProgress || []).filter((m: any) => m.moduleTestPassed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      <Breadcrumbs items={[{ label: 'Certificates' }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified Certificates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prove your Go programming competency with tamper-resistant digital credentials.
          </p>
        </div>

        {certificates.length === 0 && (
          <button
            onClick={handleClaimCertificate}
            disabled={claiming || !isEligible}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
              isEligible
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {claiming ? 'Issuing...' : 'Claim Certificate'}
          </button>
        )}
      </div>

      {/* Eligibility Status Banner */}
      <div
        className={`p-6 rounded-2xl border ${
          isEligible
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
        } space-y-3`}
      >
        <div className="flex items-center gap-3">
          {isEligible ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <Lock className="w-6 h-6 text-amber-500 shrink-0" />
          )}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isEligible ? 'Certificate Eligibility Met!' : 'Certificate Progress Tracking'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEligible
                ? 'You have satisfied all 10 modules, module tests, and capstone requirements.'
                : 'Complete all 10 modules, module tests (≥ 70%), and receive approval on your final CLI project.'}
            </p>
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                modulesDone >= totalModules ? 'text-emerald-600' : 'text-slate-300'
              }`}
            />
            <span>{totalModules} Modules Complete ({modulesDone}/{totalModules})</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                testsPassed >= totalModules ? 'text-emerald-600' : 'text-slate-300'
              }`}
            />
            <span>Module Tests Passed ({testsPassed}/{totalModules})</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${projectStatus === 'approved' ? 'text-emerald-600' : 'text-slate-300'}`}
            />
            <span>
              Capstone Project {projectStatus === 'approved' ? 'Approved' : projectStatus === 'pending' ? 'Awaiting Review' : projectStatus === 'rejected' ? 'Needs Changes' : 'Not Submitted'}
            </span>
          </div>
        </div>
      </div>

      {/* Issued Certificates List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Your Issued Credentials ({certificates.length})
        </h2>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Verified Certificate
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      ID: {cert.certificateId}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/certificates/${cert.certificateId}`}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    View & Download PDF →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No Certificates Earned Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Continue your sequential learning path in the Go course to qualify for your verified digital certificate.
            </p>
            <Link
              to="/dashboard"
              className="inline-block pt-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Continue Learning →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

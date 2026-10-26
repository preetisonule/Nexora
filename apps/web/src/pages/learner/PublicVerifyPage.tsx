import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import {
  ShieldCheck,
  XCircle,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const PublicVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ApiClient.get<any>(`/certificates/${certificateId}/verify`)
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-lg" />
      </div>
    );
  }

  const cert = data?.data || data?.certificate;
  const isValid = data?.valid === true;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6">
        {/* Verification Status Header */}
        <div className="text-center space-y-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
              isValid
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {isValid ? <ShieldCheck className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Nexora Learn Registry
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isValid ? 'Verified Credential' : 'Invalid or Revoked Certificate'}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              ID: {certificateId}
            </p>
          </div>
        </div>

        {isValid && cert ? (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Recipient:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {cert.learnerName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Course:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {cert.courseTitle}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Level:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cert.courseLevel || 'Beginner to Intermediate'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Issue Date:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Officially Valid
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              This digital credential verifies the candidate demonstrated verified competency in Go syntax, data structures, concurrency, error handling, and completed the required capstone project.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs text-center space-y-1">
            <p className="font-bold">Certificate verification failed.</p>
            <p className="opacity-90">
              The requested identifier could not be verified in the active registry. It may have been revoked or does not exist.
            </p>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Visit Nexora Learn Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

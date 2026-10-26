import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, ShieldAlert, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadCertificates = () => {
    ApiClient.get<any[]>('/admin/certificates')
      .then(setCertificates)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleRevoke = async (certId: string) => {
    const reason = window.prompt('Enter reason for revoking this certificate:');
    if (!reason) return;

    try {
      await ApiClient.patch(`/admin/certificates/${certId}/revoke`, { reason });
      success('Certificate revoked');
      loadCertificates();
    } catch (err: any) {
      error(err.message || 'Failed to revoke certificate');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Certificate Administration
        </h1>
        <p className="text-xs text-slate-500">
          Inspect all issued certificates, view verification links, and revoke when necessary.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Certificate ID</th>
                <th className="p-4 font-semibold">Recipient</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Issue Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {cert.certificateId}
                  </td>
                  <td className="p-4 font-semibold">{cert.learnerName}</td>
                  <td className="p-4">{cert.courseTitle}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cert.status === 'valid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      to={`/verify/${cert.certificateId}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Verify
                    </Link>

                    {cert.status === 'valid' && (
                      <button
                        onClick={() => handleRevoke(cert.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

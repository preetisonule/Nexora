import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { Code2, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<any[]>('/assignments')
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Coding Assignments ({assignments.length})
        </h1>
        <p className="text-xs text-slate-500">
          Manage coding challenge problems, starter code, test suites, and limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((ass) => (
          <div
            key={ass.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {ass.difficulty}
              </span>
              <span className="text-xs text-slate-400">
                Passing: {ass.passingScore}%
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ass.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ass.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Timeout: {ass.timeLimitMs || 6000}ms
              </span>
              <Link
                to={`/learn/go-programming/assignment/${ass.id}`}
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Open in Monaco →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

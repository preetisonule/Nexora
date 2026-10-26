import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api';
import {
  Users,
  BookOpen,
  Award,
  Code2,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<any>('/admin/metrics')
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Registered Learners', value: metrics.totalLearners, icon: Users, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950' },
    { label: 'Active Course Enrollments', value: metrics.courseEnrollments, icon: BookOpen, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950' },
    { label: 'Total Code Submissions', value: metrics.totalSubmissions, icon: Code2, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950' },
    { label: 'Certificates Issued', value: metrics.certificatesIssued, icon: Award, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Course Completion Rate', value: `${metrics.courseCompletionRate}%`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950' },
    { label: 'Avg Assessment Score', value: `${metrics.averageAssessmentScore}%`, icon: FileCheck2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
    { label: 'Assignment Pass Rate', value: `${metrics.assignmentPassRate}%`, icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950' },
    { label: 'Platform Status', value: 'Optimal', icon: ShieldAlert, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Overview & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics, enrollment activity, submission rates, and learner progress.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Learner Module Completion Breakdown
            </h3>
            <p className="text-xs text-slate-400">Total learners who completed each of the 10 modules</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.moduleCompletionStats || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="moduleNumber" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completedCount" fill="#00A29C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Enrollment Trends
            </h3>
            <p className="text-xs text-slate-400">New learner registrations across active periods</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.enrollmentTrend || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00ADD8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Recent Code Submissions
          </h3>

          <div className="space-y-2.5">
            {metrics.recentSubmissions?.length > 0 ? (
              metrics.recentSubmissions.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white">{sub.learnerName}</p>
                    <p className="text-slate-400 text-[11px]">{sub.assignmentTitle}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        sub.passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {sub.score}% {sub.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(sub.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No submissions recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recently Registered Learners */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Recently Registered Learners
          </h3>

          <div className="space-y-2.5">
            {metrics.recentLearners?.length > 0 ? (
              metrics.recentLearners.map((lrn: any) => (
                <div
                  key={lrn.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white">{lrn.name}</p>
                    <p className="text-slate-400 text-[11px]">{lrn.email}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      {lrn.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(lrn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No learners registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api';
import { IAdminMetrics } from '@compilo/shared';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Filter,
  RefreshCw,
  Code2,
  BookOpen,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<IAdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCourse, setSelectedCourse] = useState('go-programming');

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get<IAdminMetrics>('/admin/metrics');
      setMetrics(res);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Pass vs Fail distribution
  const submissionData = [
    { name: 'Passed Submissions', value: Math.round(metrics.totalSubmissions * (metrics.assignmentPassRate / 100)) || 1, color: '#167D52' },
    { name: 'Failed / Incomplete', value: Math.max(0, metrics.totalSubmissions - Math.round(metrics.totalSubmissions * (metrics.assignmentPassRate / 100))), color: '#C53D43' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand" />
            Curriculum & Learner Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time data on student progression, module completion rates, coding performance, and certificate metrics.
          </p>
        </div>

        {/* Date & Course Filters */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="go-programming">Go Programming: Beginner to Intermediate</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={loadMetrics}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 shadow-xs"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Learners</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.activeLearners}
          </div>
          <p className="text-[11px] text-slate-400">
            Across {metrics.courseEnrollments} total enrollments
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.courseCompletionRate}%
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${metrics.courseCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Coding Pass Rate</span>
            <Code2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {metrics.assignmentPassRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {metrics.totalSubmissions} Go compiler submissions evaluated
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates Issued</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.certificatesIssued}
          </div>
          <p className="text-[11px] text-slate-400">
            Average test score: {metrics.averageAssessmentScore}%
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion Funnel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Learner Completion by Module (1–10)
            </h3>
            <p className="text-xs text-slate-500">
              Shows sequential progression volume across each curriculum module.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.moduleCompletionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="moduleNumber" tickFormatter={(val) => `M${val}`} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Learners`, 'Completed']}
                  labelFormatter={(lbl) => `Module ${lbl}`}
                />
                <Bar dataKey="completedCount" fill="#167D52" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Enrollment & Activity Velocity
            </h3>
            <p className="text-xs text-slate-500">
              New learner enrollments and interactive activity over the recent period.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.enrollmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#167D52" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#167D52" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Enrollments`, 'Count']}
                />
                <Area type="monotone" dataKey="count" stroke="#167D52" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Code Pass Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass vs Fail Ratio */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Submission Pass Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Automated compiler test pass vs fail ratio.
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {submissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Submissions Feed */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Code Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Recent learner submissions evaluated by the Go runner.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Total: {metrics.totalSubmissions}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <tr>
                  <th className="pb-2 font-semibold">Learner</th>
                  <th className="pb-2 font-semibold">Assignment</th>
                  <th className="pb-2 font-semibold">Score</th>
                  <th className="pb-2 font-semibold">Result</th>
                  <th className="pb-2 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.recentSubmissions && metrics.recentSubmissions.length > 0 ? (
                  metrics.recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                        {sub.learnerName}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                        {sub.assignmentTitle}
                      </td>
                      <td className="py-2.5 font-mono">{sub.score}%</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.passed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {sub.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400 text-[11px]">
                        {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No code submissions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

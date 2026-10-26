import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  FolderGit2,
  CheckCircle2,
  Send,
  FileCode2,
  Clock,
  Layers,
  Award,
  Terminal,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const FinalProjectPage: React.FC = () => {
  const { success, error } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [documentationText, setDocumentationText] = useState('');
  const [testInstructions, setTestInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<any>('/projects/me')
      .then((data) => {
        if (data) {
          setSubmission(data);
          setRepositoryUrl(data.repositoryUrl || '');
          setDocumentationText(data.documentationText || '');
          setTestInstructions(data.testInstructions || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentationText.trim()) {
      error('Documentation text is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ApiClient.post<any>('/projects/submit', {
        repositoryUrl,
        documentationText,
        testInstructions,
      });
      setSubmission(res);
      success('Project submitted successfully for instructor review!');
    } catch (err: any) {
      error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: 'Go Programming', path: '/courses/go-programming' },
          { label: 'Capstone Project' },
        ]}
      />

      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-brand-950 via-slate-900 to-slate-900 text-white shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
            Module 10 Capstone
          </span>
          {submission && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                submission.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : submission.status === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              Status: {submission.status}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Capstone Project: CLI-Based Task Manager
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Apply all 10 modules of the Go Programming course. Architect, implement, test, and document an idiomatic CLI tool in Go.
        </p>
      </div>

      {/* Evaluation Rubric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: '1. Structs & Architecture',
            desc: 'Clean task models, methods with pointer receivers, and decoupled package boundaries (cmd/ and internal/).',
          },
          {
            title: '2. JSON State Persistence',
            desc: 'Save and load tasks reliably from tasks.json using encoding/json with proper file permissions and safe I/O.',
          },
          {
            title: '3. Explicit Error Handling',
            desc: 'Wrap errors with %w, check sentinel conditions, and ensure the tool handles missing files and invalid inputs.',
          },
          {
            title: '4. Automated Unit Tests',
            desc: 'Comprehensive unit tests in _test.go using testing.T, table-driven test patterns, and code coverage.',
          },
        ].map((rubric, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1.5"
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {rubric.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {rubric.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Instructor Review Feedback (if reviewed) */}
      {submission && submission.reviewNotes && (
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Instructor Review Notes
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {submission.reviewNotes}
          </p>
          {submission.score && (
            <p className="text-xs font-bold text-emerald-600">
              Evaluated Score: {submission.score}%
            </p>
          )}
        </div>
      )}

      {/* Submission Form */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-brand-600" />
          Project Submission Form
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              GitHub / Git Repository URL (Optional)
            </label>
            <input
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/your-username/go-task-manager"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Architecture & Documentation Overview *
            </label>
            <textarea
              required
              rows={6}
              value={documentationText}
              onChange={(e) => setDocumentationText(e.target.value)}
              placeholder="Explain how your task manager is structured, which packages you created, how JSON persistence works, and which Go language features you incorporated..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Test Execution Instructions *
            </label>
            <input
              type="text"
              required
              value={testInstructions}
              onChange={(e) => setTestInstructions(e.target.value)}
              placeholder='e.g., go test -v ./... or go run main.go add "Buy groceries"'
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-elevated flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : submission ? 'Update Submission' : 'Submit Capstone Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

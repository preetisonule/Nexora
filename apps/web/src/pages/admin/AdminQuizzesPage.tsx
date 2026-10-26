import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<any[]>('/quizzes')
      .then(setQuizzes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Quizzes & Module Tests ({quizzes.length})
        </h1>
        <p className="text-xs text-slate-500">
          Inspect assessment questions, passing thresholds, and attempt limits.
        </p>
      </div>

      <div className="space-y-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {quiz.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {quiz.isModuleTest ? 'Module Test' : 'Concept Quiz'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Passing: {quiz.passingScore}% • Max Attempts: {quiz.maxAttempts}
                </p>
              </div>
            </div>

            <Link
              to={`/learn/go-programming/assessment/${quiz.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 hover:bg-brand-100 shrink-0"
            >
              Test Assessment →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

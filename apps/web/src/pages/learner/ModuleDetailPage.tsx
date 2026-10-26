import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  HelpCircle,
  Clock,
  ShieldAlert,
  Play,
  FileCheck2,
} from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [moduleData, setModuleData] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const [mod, quizzesData, assignmentsData] = await Promise.all([
          ApiClient.get<any>(`/modules/${moduleId}`),
          ApiClient.get<any[]>(`/quizzes?moduleId=${moduleId}`).catch(() => []),
          ApiClient.get<any[]>(`/assignments?moduleId=${moduleId}`).catch(() => []),
        ]);

        setModuleData(mod);
        setQuizzes(quizzesData || []);
        setAssignments(assignmentsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading || !moduleData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const isUnlocked = moduleData.unlocked !== false;
  const isCompleted = moduleData.completed === true;

  // Filter quizzes into concept quiz vs module test
  const conceptQuiz = quizzes.find((q) => !q.isModuleTest) || { id: 'demo-quiz', title: `${moduleData.title} Quiz`, passingScore: 70 };
  const moduleTest = quizzes.find((q) => q.isModuleTest) || { id: 'demo-test', title: `Module ${moduleData.order} Comprehensive Test`, passingScore: 70 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: 'Go Programming', path: '/courses/go-programming' },
          { label: `Module ${moduleData.order}` },
        ]}
      />

      {/* Lock Notification if locked */}
      {!isUnlocked && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm">This module is currently locked</h4>
            <p className="leading-relaxed">
              In accordance with Google Skills sequential mastery standards, you must satisfy all completion requirements of the preceding module before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Module Header Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Module {moduleData.order} of 10
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {moduleData.estimatedDuration}
            </span>
          </div>

          {isCompleted ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Module Completed
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              In Progress
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {moduleData.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {moduleData.description}
        </p>

        {/* Objectives */}
        {moduleData.objectives && moduleData.objectives.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Learning Objectives
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {moduleData.objectives.map((obj: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ordered Lessons List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Lessons ({moduleData.lessons?.length || 6})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Standard Guided Template</span>
          </div>

          <div className="space-y-3">
            {moduleData.lessons?.map((les: any) => (
              <div
                key={les.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between gap-4 hover:border-brand-500/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {les.order}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {les.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {les.estimatedDuration || '30 mins'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/learn/go-programming/lesson/${les.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 hover:bg-brand-100 flex items-center gap-1 shrink-0 transition-colors"
                >
                  Study Lesson
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quizzes, Coding Assignments, Module Test */}
        <div className="space-y-6">
          {/* Concept Quiz Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Concept Quiz</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verify your mastery of key concepts before tackling coding challenges.
              </p>
            </div>
            <Link
              to={`/learn/go-programming/assessment/${conceptQuiz.id}`}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              Take Concept Quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Coding Assignments Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Coding Assignments
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Write, test, and submit real Go programs in Monaco Editor.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {assignments.length > 0 ? (
                assignments.map((ass) => (
                  <Link
                    key={ass.id}
                    to={`/learn/go-programming/assignment/${ass.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <span className="font-medium truncate max-w-[160px]">{ass.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {ass.difficulty}
                    </span>
                  </Link>
                ))
              ) : (
                <Link
                  to={`/learn/go-programming/assignment/default-assignment`}
                  className="block text-center text-xs text-brand-600 font-semibold hover:underline"
                >
                  Open Coding Workspace →
                </Link>
              )}
            </div>
          </div>

          {/* Module Test Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-950 text-white shadow-card space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-brand-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Module {moduleData.order} Comprehensive Test</h4>
              <p className="text-xs text-slate-300 mt-1">
                Pass with ≥ 70% to satisfy completion requirements for this module.
              </p>
            </div>
            <Link
              to={`/learn/go-programming/assessment/${moduleTest.id}`}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-brand-50 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              Start Module Test
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiClient } from '../../services/api';
import { ICourseProgress, IModule } from '@compilo/shared';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Award,
  Play,
  Layers,
  Sparkles,
  Clock,
  Compass,
  FileCheck2,
  Code2,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ICourseProgress | null>(null);
  const [modules, setModules] = useState<IModule[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, modulesData] = await Promise.all([
          ApiClient.get<any>('/progress/me'),
          ApiClient.get<IModule[]>('/modules'),
        ]);

        setProgress(progressData);
        setModules(modulesData || []);

        // Fetch current lesson details if available
        if (progressData?.currentLessonId) {
          try {
            const lessonData = await ApiClient.get<any>(`/lessons/${progressData.currentLessonId}`);
            setCurrentLesson(lessonData);
          } catch {
            // Ignore
          }
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-8 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-lg w-1/4" />
        <div className="h-44 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  const currentModule = modules.find((m) => m.id === progress?.currentModuleId) || modules[0];
  const nextActionLessonId = progress?.currentLessonId || currentModule?.lessons?.[0]?.id;

  // Aggregate stats from modulesProgress
  const totalLessonsDone = progress?.modulesProgress?.reduce((acc, m) => acc + (m.completedLessonsCount || 0), 0) || 0;
  const totalAssessmentsDone = progress?.modulesProgress?.filter((m) => m.moduleTestPassed || m.quizzesPassed).length || 0;
  const totalAssignmentsDone = progress?.modulesProgress?.filter((m) => m.assignmentsPassed).length || 0;
  const isCourseComplete = progress?.overallPercentage === 100 || progress?.certificateEligible;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-border dark:border-ink-darkBorder pb-6">
        <div>
          <h1 className="text-page-title font-bold text-ink-primary dark:text-ink-darkText tracking-tight">
            Welcome back, {user?.name || 'Learner'}.
          </h1>
          <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-1">
            Continue building your Go skills. You are making steady progress through the curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/courses/go-programming/learning-path" className="btn-secondary">
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            Full Roadmap
          </Link>
          <Link to="/courses/go-programming" className="btn-secondary">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Curriculum
          </Link>
        </div>
      </div>

      {/* 1. FIRST HIERARCHY: Prominent Continue Learning Section */}
      <div className="card-base bg-canvas-main dark:bg-canvas-darkElevated border-l-4 border-l-brand shadow-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="badge-emerald">
              <Play className="w-3 h-3 fill-current" />
              Continue Learning
            </span>
            <span className="text-supporting text-ink-secondary dark:text-ink-darkMuted">
              {progress?.courseTitle || 'Go Programming: Beginner to Intermediate'}
            </span>
          </div>

          <div className="text-supporting font-semibold text-brand">
            {progress?.overallPercentage || 0}% Course Completed
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-ink-secondary dark:text-ink-darkMuted">
            Module {currentModule?.order || 1}: {currentModule?.title || 'Getting Started with Go'}
          </div>

          <h2 className="text-section-heading font-bold text-ink-primary dark:text-ink-darkText">
            {currentLesson ? currentLesson.title : 'Introduction to Go Syntax and Toolchain'}
          </h2>

          <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted max-w-3xl leading-relaxed">
            {currentLesson?.introduction || currentModule?.description || 'Build solid foundational Go skills.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${progress?.overallPercentage || 0}%` }}
          />
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center gap-4">
          {nextActionLessonId ? (
            <Link
              to={`/learn/go-programming/lesson/${nextActionLessonId}`}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Resume Next Lesson
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Link
              to={`/learn/go-programming/module/${currentModule?.id}`}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Open Active Module
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}

          <Link
            to="/learn/go-programming/assignment/default-assignment"
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            Open Coding Sandbox
          </Link>
        </div>
      </div>

      {/* 2. SECOND HIERARCHY: Structured Learning-Path (10 Modules) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-heading font-bold text-ink-primary dark:text-ink-darkText">
              Structured Learning Path
            </h3>
            <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-0.5">
              Sequential 10-module curriculum. Satisfy requirements to unlock subsequent skills.
            </p>
          </div>

          <Link
            to="/courses/go-programming/learning-path"
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            View Interactive Roadmap →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const isUnlocked = mod.unlocked !== false;
            const isCompleted = mod.completed === true;

            return (
              <div
                key={mod.id}
                className={`card-base p-4 transition-all ${
                  isCompleted
                    ? 'border-brand/30 bg-brand-subtle/20 dark:bg-brand-900/10'
                    : isUnlocked
                    ? 'border-ink-border dark:border-ink-darkBorder hover:border-brand/40'
                    : 'opacity-70 bg-canvas-subtle dark:bg-canvas-darkSubtle border-dashed'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-state-success text-white'
                          : isUnlocked
                          ? 'bg-brand text-white'
                          : 'bg-canvas-subtle dark:bg-canvas-darkSubtle text-ink-tertiary border border-ink-border dark:border-ink-darkBorder'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-ink-secondary dark:text-ink-darkMuted">
                          Module {mod.order}
                        </span>
                        {isCompleted && (
                          <span className="badge-emerald text-[10px]">Completed</span>
                        )}
                        {!isUnlocked && (
                          <span className="badge-neutral text-[10px]">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>

                      <h4 className="text-card-title font-semibold text-ink-primary dark:text-ink-darkText truncate">
                        {mod.title}
                      </h4>

                      <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted line-clamp-1">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-ink-border dark:border-ink-darkBorder flex items-center justify-between text-supporting text-ink-secondary dark:text-ink-darkMuted">
                  <span className="flex items-center gap-1 text-[12px]">
                    <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
                    {mod.estimatedDuration}
                  </span>

                  {isUnlocked ? (
                    <Link
                      to={`/learn/go-programming/module/${mod.id}`}
                      className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                    >
                      {isCompleted ? 'Review' : 'Continue'} →
                    </Link>
                  ) : (
                    <span className="text-[11px] text-ink-tertiary flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Complete Module {mod.order - 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. THIRD HIERARCHY: Compact Activity Summary */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-ink-darkMuted">
          Curriculum Milestone Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-base p-4 space-y-1">
            <div className="flex items-center justify-between text-ink-secondary dark:text-ink-darkMuted text-supporting">
              <span>Lessons Done</span>
              <BookOpen className="w-4 h-4 text-brand" />
            </div>
            <div className="text-2xl font-bold text-ink-primary dark:text-ink-darkText">
              {totalLessonsDone} <span className="text-xs font-normal text-ink-tertiary">/ 60</span>
            </div>
            <p className="text-[11px] text-ink-secondary dark:text-ink-darkMuted">Structured lessons completed</p>
          </div>

          <div className="card-base p-4 space-y-1">
            <div className="flex items-center justify-between text-ink-secondary dark:text-ink-darkMuted text-supporting">
              <span>Tests Passed</span>
              <FileCheck2 className="w-4 h-4 text-brand" />
            </div>
            <div className="text-2xl font-bold text-ink-primary dark:text-ink-darkText">
              {totalAssessmentsDone} <span className="text-xs font-normal text-ink-tertiary">/ 10</span>
            </div>
            <p className="text-[11px] text-ink-secondary dark:text-ink-darkMuted">Module assessments verified</p>
          </div>

          <div className="card-base p-4 space-y-1">
            <div className="flex items-center justify-between text-ink-secondary dark:text-ink-darkMuted text-supporting">
              <span>Coding Labs</span>
              <Code2 className="w-4 h-4 text-brand" />
            </div>
            <div className="text-2xl font-bold text-ink-primary dark:text-ink-darkText">
              {totalAssignmentsDone} <span className="text-xs font-normal text-ink-tertiary">/ 14</span>
            </div>
            <p className="text-[11px] text-ink-secondary dark:text-ink-darkMuted">Sandbox assignments passed</p>
          </div>

          <div className="card-base p-4 space-y-1">
            <div className="flex items-center justify-between text-ink-secondary dark:text-ink-darkMuted text-supporting">
              <span>Certificate</span>
              <Award className="w-4 h-4 text-brand" />
            </div>
            <div className="text-base font-bold text-ink-primary dark:text-ink-darkText flex items-center gap-1.5 pt-1">
              {progress?.certificateEligible ? (
                <span className="text-state-success flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Eligible
                </span>
              ) : (
                <span className="text-ink-secondary dark:text-ink-darkMuted font-medium">In Progress</span>
              )}
            </div>
            <Link to="/certificates" className="text-[11px] font-semibold text-brand hover:underline inline-block">
              Inspect status →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. FOURTH HIERARCHY: Final Capstone & Verification Banner */}
      <div className="card-base p-6 bg-gradient-to-r from-canvas-main via-canvas-subtle to-canvas-main dark:from-canvas-darkElevated dark:to-canvas-darkElevated border border-ink-border dark:border-ink-darkBorder flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-subtle dark:bg-brand-900/30 text-brand flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Capstone Milestone
            </span>
            <h4 className="text-card-title font-bold text-ink-primary dark:text-ink-darkText">
              CLI Task Manager Project in Go
            </h4>
            <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-0.5 max-w-xl">
              Fulfill all 10 modules, submit your JSON-persisting CLI tool, and claim your cryptographic certificate of completion.
            </p>
          </div>
        </div>

        <Link to="/projects" className="btn-primary shrink-0">
          Open Project Details
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
};

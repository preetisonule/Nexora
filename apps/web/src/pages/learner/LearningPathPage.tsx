import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { IModule, ICourseProgress } from '@compilo/shared';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  Play,
  HelpCircle,
  Code2,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
  const [modules, setModules] = useState<IModule[]>([]);
  const [progress, setProgress] = useState<ICourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mods, prog] = await Promise.all([
          ApiClient.get<IModule[]>('/modules'),
          ApiClient.get<ICourseProgress>('/progress/me').catch(() => null),
        ]);
        setModules(mods || []);
        setProgress(prog);

        // Auto-expand the currently active module
        const activeMod = mods?.find((m) => m.unlocked !== false && !m.completed);
        if (activeMod) {
          setExpandedModules({ [activeMod.id]: true });
        } else if (mods?.length) {
          setExpandedModules({ [mods[0].id]: true });
        }
      } catch (err) {
        console.error('Failed to load learning path:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-lg w-1/3" />
        <div className="h-24 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  const completedCount = modules.filter((m) => m.completed).length;
  const currentModule = modules.find((m) => m.unlocked !== false && !m.completed) || modules[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: 'Go Programming', path: '/courses/go-programming' },
          { label: 'Sequential Learning Path' },
        ]}
      />

      {/* Header & Progress Banner */}
      <div className="card-base flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-l-brand">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="badge-emerald">
              <Compass className="w-3.5 h-3.5" />
              Sequential Curriculum Map
            </span>
            <span className="text-xs text-ink-secondary dark:text-ink-darkMuted font-medium">
              Google Skills Standard
            </span>
          </div>
          <h1 className="text-section-heading text-ink-primary dark:text-ink-darkText tracking-tight font-bold">
            Go Programming Roadmap
          </h1>
          <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted max-w-xl">
            Each module is unlocked as you complete prerequisite lessons, quizzes, and tests. Study at your own pace with verified mastery at every step.
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-xs text-ink-secondary dark:text-ink-darkMuted font-medium">
            Path Completion
          </span>
          <div className="text-2xl font-bold text-brand mt-0.5">
            {completedCount} of {modules.length} <span className="text-xs font-normal text-ink-secondary dark:text-ink-darkMuted">Modules</span>
          </div>
          <div className="w-36 h-2 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-full overflow-hidden mt-2 sm:ml-auto">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${Math.round((completedCount / (modules.length || 10)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Timeline / Structured Roadmap */}
      <div className="relative border-l-2 border-ink-border dark:border-ink-darkBorder ml-4 sm:ml-6 space-y-6 pl-6 sm:pl-8">
        {modules.map((mod, idx) => {
          const isCompleted = mod.completed === true;
          const isUnlocked = mod.unlocked !== false;
          const isCurrent = isUnlocked && !isCompleted;
          const isExpanded = !!expandedModules[mod.id];
          const lessonsCount = mod.totalLessonsCount || mod.lessons?.length || 6;

          return (
            <div key={mod.id} className="relative group">
              {/* Timeline Marker Node */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-state-success border-state-success text-white'
                    : isCurrent
                    ? 'bg-brand border-brand text-white shadow-sm ring-4 ring-brand-100 dark:ring-brand-900/40'
                    : 'bg-canvas-main dark:bg-canvas-darkElevated border-ink-border dark:border-ink-darkBorder text-ink-tertiary'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{mod.order}</span>
                )}
              </div>

              {/* Module Roadmap Card */}
              <div
                className={`card-base transition-all ${
                  isCurrent
                    ? 'border-brand/40 shadow-card ring-1 ring-brand/10'
                    : isCompleted
                    ? 'bg-canvas-subtle/50 dark:bg-canvas-darkSubtle/30'
                    : 'opacity-85'
                }`}
              >
                {/* Top Row: Info + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary dark:text-ink-darkMuted">
                        Module {mod.order}
                      </span>
                      {isCompleted && (
                        <span className="badge-emerald">Completed</span>
                      )}
                      {isCurrent && (
                        <span className="badge-emerald">Active Learning</span>
                      )}
                      {!isUnlocked && (
                        <span className="badge-neutral text-ink-secondary">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-card-title font-semibold text-ink-primary dark:text-ink-darkText">
                      {mod.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <Link
                        to={`/learn/go-programming/module/${mod.id}`}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                          isCurrent
                            ? 'bg-brand hover:bg-brand-hover text-white'
                            : 'btn-secondary'
                        }`}
                      >
                        {isCompleted ? 'Review Module' : 'Continue Module'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-ink-secondary dark:text-ink-darkMuted flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Complete Module {mod.order - 1} to unlock
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(mod.id)}
                      className="p-1.5 rounded-md hover:bg-canvas-subtle dark:hover:bg-canvas-darkSubtle text-ink-secondary dark:text-ink-darkMuted"
                      title={isExpanded ? 'Collapse lessons' : 'Expand lessons'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-2 leading-relaxed">
                  {mod.description}
                </p>

                {/* Metadata Row */}
                <div className="mt-4 pt-3 border-t border-ink-border dark:border-ink-darkBorder flex flex-wrap items-center justify-between text-supporting text-ink-secondary dark:text-ink-darkMuted gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-ink-tertiary" />
                      {lessonsCount} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
                      {mod.estimatedDuration}
                    </span>
                  </div>

                  {mod.objectives && mod.objectives.length > 0 && (
                    <span className="text-[12px] text-ink-tertiary hidden md:inline">
                      Key Focus: {mod.objectives[0]}
                    </span>
                  )}
                </div>

                {/* Expandable Lessons Section */}
                {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-ink-border dark:border-ink-darkBorder space-y-2">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-ink-secondary dark:text-ink-darkMuted mb-2">
                      Lessons in Module {mod.order}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle dark:bg-canvas-darkSubtle border border-ink-border/50 dark:border-ink-darkBorder/50 text-supporting"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="text-xs font-mono font-medium text-ink-tertiary w-5 shrink-0">
                              {mod.order}.{les.order}
                            </span>
                            <span className="truncate text-ink-primary dark:text-ink-darkText font-medium">
                              {les.title}
                            </span>
                          </div>

                          {isUnlocked ? (
                            <Link
                              to={`/learn/go-programming/lesson/${les.id}`}
                              className="text-[11px] font-semibold text-brand hover:underline shrink-0"
                            >
                              Study
                            </Link>
                          ) : (
                            <Lock className="w-3 h-3 text-ink-tertiary shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone & Certificate Footer Indicator */}
      <div className="card-base bg-gradient-to-r from-canvas-subtle via-canvas-main to-canvas-subtle dark:from-canvas-darkSubtle dark:to-canvas-darkSubtle border-brand/20 flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-subtle dark:bg-brand-900/30 text-brand flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-card-title font-bold text-ink-primary dark:text-ink-darkText">
              Final Milestone: Capstone Project & Verifiable Credential
            </h4>
            <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-0.5">
              Fulfill all 10 modules, pass comprehensive module tests, and build the CLI Task Manager to claim your certificate.
            </p>
          </div>
        </div>

        <Link to="/projects" className="btn-primary shrink-0">
          Inspect Capstone Rubric
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
};

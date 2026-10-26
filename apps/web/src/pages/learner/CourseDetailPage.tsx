import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { ICourse, IModule, ICourseProgress } from '@compilo/shared';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Code2,
  ChevronDown,
  ChevronUp,
  Compass,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [modules, setModules] = useState<IModule[]>([]);
  const [progress, setProgress] = useState<ICourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const c = await ApiClient.get<ICourse>(`/courses/${slug || 'go-programming'}`);
        setCourse(c);
        const [mList, prog] = await Promise.all([
          ApiClient.get<IModule[]>(`/modules?courseId=${c.id}`),
          ApiClient.get<ICourseProgress>('/progress/me').catch(() => null),
        ]);
        setModules(mList || []);
        setProgress(prog);

        // Expand module 1 by default
        if (mList && mList.length > 0) {
          setExpandedModules({ [mList[0].id]: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  if (loading || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-lg w-1/3" />
        <div className="h-44 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
        <div className="h-96 bg-canvas-subtle dark:bg-canvas-darkSubtle rounded-card" />
      </div>
    );
  }

  const isEnrolled = !!progress?.enrolled;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: course.title },
        ]}
      />

      {/* Course Banner Header */}
      <div className="card-base p-6 sm:p-8 space-y-5 border-l-4 border-l-brand">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="badge-emerald">
            {course.level}
          </span>
          <span className="flex items-center gap-1 text-ink-secondary dark:text-ink-darkMuted text-supporting">
            <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
            {course.estimatedDuration}
          </span>
          <span className="flex items-center gap-1 text-ink-secondary dark:text-ink-darkMuted text-supporting">
            <BookOpen className="w-3.5 h-3.5 text-ink-tertiary" />
            10 Modules (60 Lessons)
          </span>
          <span className="flex items-center gap-1 text-ink-secondary dark:text-ink-darkMuted text-supporting">
            <Award className="w-3.5 h-3.5 text-ink-tertiary" />
            Verifiable Digital Credential
          </span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="text-section-heading sm:text-page-title font-bold text-ink-primary dark:text-ink-darkText tracking-tight">
            {course.title}
          </h1>
          <p className="text-body text-ink-secondary dark:text-ink-darkMuted leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={isEnrolled ? '/dashboard' : isAuthenticated ? '/dashboard' : '/register'}
            className="btn-primary py-2.5 px-6 text-sm"
          >
            {isEnrolled ? 'Continue Learning' : 'Start Course'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            to="/courses/go-programming/learning-path"
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            View Sequential Roadmap
          </Link>

          <Link
            to="/certificates"
            className="btn-subtle text-xs"
          >
            Certificate Specifications
          </Link>
        </div>
      </div>

      {/* Grid: 2-Columns (Modules Curriculum vs Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Expandable Modules List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-card-title font-bold text-ink-primary dark:text-ink-darkText">
                Course Curriculum ({modules.length} Modules)
              </h2>
              <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted mt-0.5">
                Each module includes concept tutorials, knowledge checks, a coding lab, and an assessment.
              </p>
            </div>

            <button
              onClick={() => {
                const allExpanded = Object.keys(expandedModules).length === modules.length;
                if (allExpanded) {
                  setExpandedModules({});
                } else {
                  const map: Record<string, boolean> = {};
                  modules.forEach((m) => (map[m.id] = true));
                  setExpandedModules(map);
                }
              }}
              className="text-xs text-brand hover:underline font-semibold"
            >
              {Object.keys(expandedModules).length === modules.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isExpanded = !!expandedModules[mod.id];
              const isCompleted = mod.completed === true;
              const isUnlocked = mod.unlocked !== false;

              return (
                <div
                  key={mod.id}
                  className={`card-base p-0 overflow-hidden transition-colors ${
                    isCompleted
                      ? 'border-brand/30'
                      : isUnlocked
                      ? 'hover:border-brand/40'
                      : 'opacity-75 bg-canvas-subtle dark:bg-canvas-darkSubtle'
                  }`}
                >
                  {/* Module Accordion Header */}
                  <div
                    onClick={() => toggleExpand(mod.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas-subtle dark:hover:bg-canvas-darkSubtle transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-state-success text-white'
                            : isUnlocked
                            ? 'bg-brand-subtle text-brand border border-brand-200'
                            : 'bg-canvas-subtle dark:bg-canvas-darkSubtle text-ink-tertiary border border-ink-border'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-secondary dark:text-ink-darkMuted">
                            Module {mod.order}
                          </span>
                          {isCompleted && <span className="badge-emerald text-[10px]">Completed</span>}
                          {!isUnlocked && (
                            <span className="badge-neutral text-[10px]">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                        </div>

                        <h3 className="text-supporting sm:text-card-title font-semibold text-ink-primary dark:text-ink-darkText truncate">
                          {mod.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-supporting text-ink-secondary dark:text-ink-darkMuted hidden sm:inline">
                        {mod.totalLessonsCount || mod.lessons?.length || 6} Lessons • {mod.estimatedDuration}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
                    </div>
                  </div>

                  {/* Expanded Lessons & Lab Info */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-ink-border dark:border-ink-darkBorder bg-canvas-subtle/40 dark:bg-canvas-darkSubtle/20 space-y-4">
                      <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Lesson list */}
                      {mod.lessons && mod.lessons.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-ink-tertiary">
                            Structured Lessons:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mod.lessons.map((les) => (
                              <div
                                key={les.id}
                                className="p-2.5 rounded-lg bg-canvas-main dark:bg-canvas-darkElevated border border-ink-border dark:border-ink-darkBorder flex items-center justify-between gap-2 text-supporting"
                              >
                                <span className="text-xs text-ink-primary dark:text-ink-darkText font-medium truncate">
                                  {les.order}. {les.title}
                                </span>
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

                      {/* Module Actions Footer */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-ink-tertiary">
                          Includes Coding Assignment & Comprehensive Module Test
                        </span>
                        {isUnlocked && (
                          <Link
                            to={`/learn/go-programming/module/${mod.id}`}
                            className="btn-secondary text-xs"
                          >
                            Enter Module Workspace →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Objectives, Prerequisites, Capstone Project */}
        <div className="lg:col-span-4 space-y-6">
          {/* Objectives */}
          <div className="card-base space-y-3">
            <h3 className="text-card-title font-bold text-ink-primary dark:text-ink-darkText">
              Course Learning Objectives
            </h3>
            <ul className="space-y-2 text-supporting text-ink-secondary dark:text-ink-darkMuted">
              {course.learningObjectives?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div className="card-base space-y-2">
            <h3 className="text-card-title font-bold text-ink-primary dark:text-ink-darkText">
              Target Audience & Prerequisites
            </h3>
            <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted leading-relaxed">
              Familiarity with loops, functions, and elementary data structures in Python, Java, or JavaScript. No prior Go background required.
            </p>
          </div>

          {/* Capstone Callout */}
          <div className="card-base border-brand/40 bg-brand-subtle dark:bg-brand-900/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand">
              <Code2 className="w-5 h-5" />
              <h4 className="font-bold text-sm text-ink-primary dark:text-ink-darkText">
                Capstone Project
              </h4>
            </div>
            <p className="text-supporting text-ink-secondary dark:text-ink-darkMuted leading-relaxed">
              Build a production-grade CLI Task Manager in Go featuring JSON persistence, struct modeling, and unit tests.
            </p>
            <Link to="/projects" className="btn-primary w-full text-center">
              View Capstone Specifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

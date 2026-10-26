import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Layers, CheckCircle2, Clock, BookOpen, Edit2, ShieldAlert } from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadCourses = () => {
    ApiClient.get<any[]>('/courses')
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleTogglePublish = async (courseId: string, current: boolean) => {
    try {
      await ApiClient.patch(`/courses/${courseId}`, { published: !current });
      success(`Course ${!current ? 'published' : 'unpublished'}`);
      loadCourses();
    } catch (err: any) {
      error(err.message || 'Failed to update course');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure learning paths, descriptions, objectives, and publication status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {course.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      course.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">{course.description}</p>
              </div>

              <button
                onClick={() => handleTogglePublish(course.id, course.published)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {course.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {course.estimatedDuration}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {course.moduleCount || 10} Modules
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

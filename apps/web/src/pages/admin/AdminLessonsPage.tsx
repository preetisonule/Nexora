import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { BookOpen, Clock, CheckCircle2, Search, Filter } from 'lucide-react';

export const AdminLessonsPage: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<any[]>('/modules')
      .then(setModules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allLessons = modules.flatMap((m) =>
    (m.lessons || []).map((l: any) => ({
      ...l,
      moduleTitle: m.title,
      moduleOrder: m.order,
    }))
  );

  const filteredLessons = allLessons.filter((l) => {
    const matchesModule = selectedModuleId === 'all' || l.moduleId === selectedModuleId;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lesson Management ({filteredLessons.length})
          </h1>
          <p className="text-xs text-slate-500">
            Inspect educational lesson content, code examples, and knowledge checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                Module {m.order}: {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredLessons.map((les) => (
          <div
            key={les.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                M{les.moduleOrder}.{les.order}
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {les.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {les.moduleTitle} • {les.estimatedDuration || '30 mins'}
                </p>
              </div>
            </div>

            <Link
              to={`/learn/go-programming/lesson/${les.id}`}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 hover:bg-brand-100 shrink-0"
            >
              Preview Lesson →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

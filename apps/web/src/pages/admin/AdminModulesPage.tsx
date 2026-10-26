import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BookOpen, MoveUp, MoveDown, CheckCircle2, Lock, Plus } from 'lucide-react';

export const AdminModulesPage: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadModules = () => {
    ApiClient.get<any[]>('/modules')
      .then(setModules)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleReorder = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const newModules = [...modules];
    const temp = newModules[idx];
    newModules[idx] = newModules[targetIdx];
    newModules[targetIdx] = temp;

    const moduleOrders = newModules.map((m, i) => ({ id: m.id, order: i + 1 }));

    try {
      await ApiClient.patch('/modules/reorder', { moduleOrders });
      success('Modules reordered successfully');
      loadModules();
    } catch (err: any) {
      error(err.message || 'Failed to reorder modules');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Module Management
          </h1>
          <p className="text-xs text-slate-500">
            Reorder curriculum modules and configure completion thresholds.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <div
            key={mod.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                {mod.order}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {mod.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {mod.lessons?.length || 6} Lessons • {mod.estimatedDuration}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={idx === 0}
                onClick={() => handleReorder(idx, 'up')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                disabled={idx === modules.length - 1}
                onClick={() => handleReorder(idx, 'down')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              >
                <MoveDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

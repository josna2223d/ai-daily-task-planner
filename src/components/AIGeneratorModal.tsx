import React, { useState } from 'react';
import { useTaskStore } from '../store/TaskContext';
import { generateDailyPlan } from '../lib/api';
import { Sparkles, X, Loader2 } from 'lucide-react';
// import removed

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [goals, setGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useTaskStore();

  const handleGenerate = async () => {
    if (!goals.trim()) return;
    setIsLoading(true);
    try {
      const generatedTasks = await generateDailyPlan(goals);
      generatedTasks.forEach((t) => addTask(t));
      onClose();
      setGoals('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold">AI Day Planner</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-white/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">
            Describe what you want to achieve today. The AI will break it down into realistic tasks with time estimates and priorities.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Your Goals</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm resize-none p-3 border text-slate-900"
              placeholder="e.g., I need to finish the React app frontend, go to the gym, and reply to client emails."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !goals.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Plan My Day
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

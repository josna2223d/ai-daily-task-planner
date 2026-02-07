import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTaskStore } from '../store/TaskContext';
import { TaskBoard } from './TaskBoard';
import { AIGeneratorModal } from './AIGeneratorModal';
import { Sparkles, Activity, CheckCircle2, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { tasks } = useTaskStore();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High').length;
  const completedHighPriorityCount = tasks.filter((t) => t.priority === 'High' && t.completed).length;

  // Productivity Score Calculation
  let productivityScore = 0;
  if (totalCount > 0) {
    const baseScore = (completedCount / totalCount) * 60;
    const priorityBonus = highPriorityCount > 0 
      ? (completedHighPriorityCount / highPriorityCount) * 40 
      : (completedCount / totalCount) * 40;
    productivityScore = Math.round(baseScore + priorityBonus);
  } else {
    productivityScore = 100; // Empty day, perfectly clean!
  }

  const getScoreEmoji = (score: number) => {
    if (score === 100) return '🏆';
    if (score >= 80) return '🔥';
    if (score >= 50) return '👍';
    if (score > 0) return '🌱';
    return '🛌';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">DayPilot AI</h1>
              <p className="text-sm text-slate-500 font-medium">
                {format(new Date(), 'EEEE, MMMM do')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Productivity Score</span>
              <div className="flex items-center gap-1.5 font-bold text-lg text-indigo-700">
                {productivityScore}% {getScoreEmoji(productivityScore)}
              </div>
            </div>

            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-5 h-5" />
              Plan My Day
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Overview Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              Good morning!
            </h2>
            <p className="text-slate-600 mb-6">
              You have <strong className="text-slate-900">{totalCount - completedCount}</strong> tasks remaining today. Let's make it count.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-600">Daily Progress</span>
                  <span className="text-indigo-600">{completedCount} / {totalCount}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-600">High Priority</span>
                  <span className="text-red-600">{completedHighPriorityCount} / {highPriorityCount}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${highPriorityCount === 0 ? 0 : (completedHighPriorityCount / highPriorityCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-800 font-bold mb-2">
                <TrendingUp className="w-5 h-5" />
                AI Suggestions
              </div>
              <p className="text-indigo-900/80 text-sm leading-relaxed mb-4">
                Not sure where to start? Tell me your goals, and I'll generate a realistic, prioritized schedule for you.
              </p>
              <button 
                onClick={() => setIsAIModalOpen(true)}
                className="text-indigo-700 text-sm font-semibold hover:text-indigo-900 flex items-center gap-1"
              >
                Try it out <Sparkles className="w-4 h-4" />
              </button>
            </div>
            <Sparkles className="w-32 h-32 text-white absolute -bottom-8 -right-8 opacity-40 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          </div>
        </div>

        {/* Right column: Main Task Board */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
          <TaskBoard />
        </div>
      </main>

      <AIGeneratorModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

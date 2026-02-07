import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { useTaskStore } from '../store/TaskContext';
import { CheckCircle2, Circle, Clock, Trash2, Sparkles, Plus, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { breakTaskIntoSteps } from '../lib/api';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask, addSubtask, toggleSubtask, removeSubtask } = useTaskStore();
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleBreakdown = async () => {
    if (task.subtasks && task.subtasks.length > 0) {
      setExpanded(true);
      return;
    }
    setIsBreakingDown(true);
    setExpanded(true);
    try {
      const steps = await breakTaskIntoSteps(task.title);
      updateTask(task.id, { subtasks: [...(task.subtasks || []), ...steps] });
    } catch (e) {
      console.error(e);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleAddSubtask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSubtask.trim()) {
      addSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const priorityColors = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-orange-50 text-orange-700 border-orange-200',
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm transition-all",
        isDragging ? "opacity-50 scale-[1.02] shadow-xl z-50" : "hover:shadow-md",
        task.completed && "opacity-60"
      )}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Checkbox */}
        <button
          onClick={() => updateTask(task.id, { completed: !task.completed })}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "text-base font-medium text-slate-900",
              task.completed && "line-through text-slate-500"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                priorityColors[task.priority]
              )}>
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            {task.timeEstimate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.timeEstimate}
              </div>
            )}
            <div className="px-2 py-0.5 bg-slate-100 rounded-md">
              {task.category}
            </div>
            
            {/* Break into steps button */}
            {!task.completed && (
              <button
                onClick={handleBreakdown}
                disabled={isBreakingDown}
                className="ml-auto flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isBreakingDown ? 'Thinking...' : 'Break down'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks Section */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 rounded-b-xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subtasks</h4>
            <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {expanded && (
            <div className="space-y-2 mt-2">
              {task.subtasks.map((st) => (
                <div key={st.id} className="flex items-center gap-2 group/st">
                  <button
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="text-slate-400 hover:text-indigo-600"
                  >
                    {st.completed ? <CheckCircle2 className="w-4 h-4 text-indigo-500" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <span className={cn("text-sm text-slate-700 flex-1", st.completed && "line-through text-slate-400")}>
                    {st.title}
                  </span>
                  <button
                    onClick={() => removeSubtask(task.id, st.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover/st:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <Plus className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={handleAddSubtask}
                  placeholder="Add a step and press Enter..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

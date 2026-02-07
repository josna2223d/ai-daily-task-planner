import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTaskStore } from '../store/TaskContext';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const TaskBoard = () => {
  const { tasks, reorderTasks, addTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim() });
    setNewTaskTitle('');
  };

  const uncompletedTasks = tasks.filter(t => !t.completed).sort((a, b) => a.order - b.order);
  const completedTasks = tasks.filter(t => t.completed).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Today's Tasks</h2>
          <p className="text-slate-500 mt-1">Focus on what matters most</p>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-8 relative shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Plus className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg transition-shadow bg-white text-slate-900 shadow-sm border"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="absolute inset-y-2 right-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </form>

      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={uncompletedTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {uncompletedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </DndContext>

        {uncompletedTasks.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No pending tasks</h3>
            <p className="text-slate-500 mt-1">Add a task above or use AI to plan your day!</p>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="pt-8 mt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-4 opacity-75">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

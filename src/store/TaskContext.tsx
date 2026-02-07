import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  clearTasks: () => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Allow mass updates (like from AI)
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_KEY = 'daypilot_tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || 'Untitled Task',
      completed: false,
      priority: task.priority || 'Medium',
      category: task.category || 'Personal',
      timeEstimate: task.timeEstimate || '',
      subtasks: task.subtasks || [],
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks.map((t, index) => ({ ...t, order: index })));
  };

  const clearTasks = () => setTasks([]);

  const addSubtask = (taskId: string, subtaskTitle: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...(t.subtasks || []), { id: uuidv4(), title: subtaskTitle, completed: false }]
        };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks?.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return t;
    }));
  };

  const removeSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks?.filter(st => st.id !== subtaskId)
        };
      }
      return t;
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, reorderTasks, clearTasks, addSubtask, toggleSubtask, removeSubtask, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskStore = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskStore must be used within a TaskProvider');
  return context;
};

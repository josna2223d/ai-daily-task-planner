export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Work' | 'Study' | 'Health' | 'Personal';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  timeEstimate?: string;
  subtasks?: Subtask[];
  createdAt: string;
  order: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

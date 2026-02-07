import { v4 as uuidv4 } from 'uuid';
import { Task, Subtask } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated OpenAI integration for planning the day
export const generateDailyPlan = async (goals: string): Promise<Partial<Task>[]> => {
  await delay(2000); // Simulate API call time
  
  const text = goals.toLowerCase();
  
  if (text.includes('code') || text.includes('build') || text.includes('app')) {
    return [
      { title: 'Wireframe and architecture design', timeEstimate: '1 hour', priority: 'High', category: 'Work' },
      { title: 'Setup project repository', timeEstimate: '30 min', priority: 'Medium', category: 'Work' },
      { title: 'Implement core features', timeEstimate: '2.5 hours', priority: 'High', category: 'Work' },
      { title: 'Drink water and stretch', timeEstimate: '10 min', priority: 'Low', category: 'Health' },
    ];
  }
  
  if (text.includes('study') || text.includes('learn')) {
    return [
      { title: 'Review previous notes', timeEstimate: '30 min', priority: 'Medium', category: 'Study' },
      { title: 'Deep dive into new topic', timeEstimate: '2 hours', priority: 'High', category: 'Study' },
      { title: 'Complete practice exercises', timeEstimate: '1 hour', priority: 'High', category: 'Study' },
      { title: 'Take a mindful break', timeEstimate: '15 min', priority: 'Low', category: 'Health' },
    ];
  }
  
  // Fallback generic tasks
  return [
    { title: 'Organize workspace', timeEstimate: '15 min', priority: 'Low', category: 'Personal' },
    { title: 'Identify top 3 priorities', timeEstimate: '10 min', priority: 'High', category: 'Work' },
    { title: 'Knock out hardest task first', timeEstimate: '2 hours', priority: 'High', category: 'Work' },
    { title: 'Reply to emails', timeEstimate: '30 min', priority: 'Medium', category: 'Work' },
  ];
};

// Simulated AI task breakdown
export const breakTaskIntoSteps = async (taskTitle: string): Promise<Subtask[]> => {
  await delay(1500);
  
  const keywords = taskTitle.split(' ').slice(0, 2).join(' ');
  return [
    { id: uuidv4(), title: `Gather context for ${keywords}`, completed: false },
    { id: uuidv4(), title: 'Draft an initial plan/outline', completed: false },
    { id: uuidv4(), title: 'Execute the main work block', completed: false },
    { id: uuidv4(), title: 'Review and finalize', completed: false },
  ];
};

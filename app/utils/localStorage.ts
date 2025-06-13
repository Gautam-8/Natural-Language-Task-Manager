import { Task } from '../types';

const TASKS_KEY = 'tasks';

export const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const addTask = (task: Task): Task[] => {
  const tasks = loadTasks();
  const updatedTasks = [task, ...tasks];
  saveTasks(updatedTasks);
  return updatedTasks;
};

export const addMultipleTasks = (newTasks: Task[]): Task[] => {
  const tasks = loadTasks();
  const updatedTasks = [...newTasks, ...tasks];
  saveTasks(updatedTasks);
  return updatedTasks;
};

export const updateTask = (id: string, updatedTask: Partial<Task>): Task[] => {
  const tasks = loadTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, ...updatedTask } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

export const toggleTaskCompletion = (id: string): Task[] => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) return tasks;
  
  return updateTask(id, { completed: !task.completed });
};

export const deleteTask = (id: string): Task[] => {
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks;
}; 
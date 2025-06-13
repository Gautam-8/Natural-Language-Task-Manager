export interface Task {
  id: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  completed: boolean;
} 
export interface Skill {
  id: string;
  name: string;
  count: number;
}

export interface Task {
  id: string;
  title: string;
  location: string;
  duration: string;
  description: string;
  createdBy: string;
  status: 'open' | 'in-progress' | 'completed';
}

export interface User {
  id: string;
  address: string;
  balance: number;
  skills: Skill[];
} 
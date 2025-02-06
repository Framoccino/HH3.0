import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, Skill, User } from '@/types';

export function useSupabase() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching tasks');
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*, user_skills(validation_count)');

      if (error) throw error;
      
      const formattedSkills: Skill[] = data.map(skill => ({
        id: skill.id,
        name: skill.name,
        count: skill.user_skills?.reduce((sum: number, us: any) => sum + (us.validation_count || 0), 0) || 0
      }));
      
      setSkills(formattedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching skills');
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdBy' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'open' }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'An error occurred creating task');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'An error occurred updating task');
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchSkills()])
      .finally(() => setLoading(false));

    // Set up real-time subscriptions
    const tasksSubscription = supabase
      .channel('public:tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new as Task, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? payload.new as Task : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, []);

  return {
    tasks,
    skills,
    loading,
    error,
    createTask,
    updateTask,
    refreshTasks: fetchTasks,
    refreshSkills: fetchSkills,
  };
} 
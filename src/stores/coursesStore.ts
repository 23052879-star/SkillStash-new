import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (course: Omit<Course, 'id' | 'created_at' | 'students'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string, userId: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ courses: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createCourse: async (course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert([course]);
      
      if (error) throw error;
      
      get().fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  updateCourse: async (id, course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },
  deleteCourse: async (id) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },
  enrollInCourse: async (courseId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({ course_id: courseId, user_id: userId });
      
      if (error) throw error;
      
      await supabase.rpc('increment_students', { course_id: courseId });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },
}));
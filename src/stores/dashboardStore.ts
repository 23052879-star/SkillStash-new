import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface DashboardState {
  downloads: any[];
  courses: any[];
  loading: boolean;
  error: string | null;
  fetchUserDownloads: (userId: string) => Promise<void>;
  fetchUserCourses: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  downloads: [],
  courses: [],
  loading: false,
  error: null,

  fetchUserDownloads: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .rpc('get_user_downloads', { user_id: userId });

      if (error) throw error;
      set({ downloads: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchUserCourses: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .rpc('get_user_courses', { p_user_id: userId });

      if (error) throw error;
      set({ courses: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
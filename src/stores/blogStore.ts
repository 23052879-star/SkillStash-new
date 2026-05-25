import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<BlogPost, 'id' | 'created_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ posts: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createPost: async (post) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([post]);
      
      if (error) throw error;
      
      get().fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  updatePost: async (id, post) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },
  deletePost: async (id) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
}));
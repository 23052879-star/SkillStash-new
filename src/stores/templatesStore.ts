import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Template = Database['public']['Tables']['templates']['Row'];

interface TemplatesState {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: Omit<Template, 'id' | 'created_at' | 'downloads' | 'rating'>) => Promise<void>;
  updateTemplate: (id: string, template: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  downloadTemplate: (templateId: string, userId: string) => Promise<void>;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,
  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ templates: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  createTemplate: async (template) => {
    try {
      const { error } = await supabase
        .from('templates')
        .insert([template]);
      
      if (error) throw error;
      
      get().fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },
  updateTemplate: async (id, template) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update(template)
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },
  deleteTemplate: async (id) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      get().fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },
  downloadTemplate: async (templateId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_downloads')
        .insert({ template_id: templateId, user_id: userId });
      
      if (error) throw error;
      
      // Update download count
      await supabase.rpc('increment_downloads', { template_id: templateId });
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  },
}));
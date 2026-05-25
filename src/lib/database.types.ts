export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          image_url: string | null
          file_url: string | null
          price: number
          downloads: number
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          image_url?: string | null
          file_url?: string | null
          price?: number
          downloads?: number
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          image_url?: string | null
          file_url?: string | null
          price?: number
          downloads?: number
          rating?: number
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          image_url: string | null
          instructor: string
          price: number
          duration: string | null
          level: string | null
          students: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          image_url?: string | null
          instructor: string
          price?: number
          duration?: string | null
          level?: string | null
          students?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          image_url?: string | null
          instructor?: string
          price?: number
          duration?: string | null
          level?: string | null
          students?: number
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          category: string
          image_url: string | null
          read_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          category: string
          image_url?: string | null
          read_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          category?: string
          image_url?: string | null
          read_time?: string | null
          created_at?: string
        }
      }
      user_downloads: {
        Row: {
          id: string
          user_id: string
          template_id: string
          downloaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          downloaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          downloaded_at?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
        }
      }
      app_resources: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          file_url: string
          image_url: string | null
          price: number
          downloads_count: number
          rating: number
          size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          file_url: string
          image_url?: string | null
          price?: number
          downloads_count?: number
          rating?: number
          size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          file_url?: string
          image_url?: string | null
          price?: number
          downloads_count?: number
          rating?: number
          size_bytes?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
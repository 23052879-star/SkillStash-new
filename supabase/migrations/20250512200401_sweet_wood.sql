/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - created_at (timestamp)
    
    - templates
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - category (text)
      - image_url (text)
      - file_url (text)
      - price (numeric)
      - downloads (integer)
      - rating (numeric)
      - created_at (timestamp)
    
    - courses
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - category (text)
      - image_url (text)
      - instructor (text)
      - price (numeric)
      - duration (text)
      - level (text)
      - students (integer)
      - created_at (timestamp)
    
    - blog_posts
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - excerpt (text)
      - category (text)
      - image_url (text)
      - read_time (text)
      - created_at (timestamp)
    
    - user_downloads
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - template_id (uuid, references templates)
      - downloaded_at (timestamp)
    
    - course_enrollments
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - course_id (uuid, references courses)
      - enrolled_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text,
  file_url text,
  price numeric NOT NULL DEFAULT 0,
  downloads integer DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
  ON templates
  FOR SELECT
  TO public
  USING (true);

-- Courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text,
  instructor text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration text,
  level text,
  students integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
  ON courses
  FOR SELECT
  TO public
  USING (true);

-- Blog posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text NOT NULL,
  image_url text,
  read_time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

-- User downloads table
CREATE TABLE user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now()
);

ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads"
  ON user_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads"
  ON user_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Course enrollments table
CREATE TABLE course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now()
);

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON course_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
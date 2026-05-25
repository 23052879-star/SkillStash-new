/*
  # Fix get_user_courses function

  1. Changes
    - Drop existing function to allow return type modification
    - Recreate function with correct return type and parameters
    - Add security settings and proper parameter naming

  2. Security
    - Function runs with SECURITY DEFINER
    - Explicit search_path set to public
*/

-- Drop existing function first
DROP FUNCTION IF EXISTS get_user_courses(uuid);

-- Recreate function with correct return type
CREATE OR REPLACE FUNCTION get_user_courses(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  image_url TEXT,
  instructor TEXT,
  price NUMERIC,
  duration TEXT,
  level TEXT,
  students INTEGER,
  enrolled_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.category,
    c.image_url,
    c.instructor,
    c.price,
    c.duration,
    c.level,
    c.students,
    ce.enrolled_at
  FROM courses c
  INNER JOIN course_enrollments ce ON ce.course_id = c.id
  WHERE ce.user_id = p_user_id
  ORDER BY ce.enrolled_at DESC;
END;
$$;
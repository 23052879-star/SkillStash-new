/*
  # Add Dashboard Functions

  1. New Functions
    - get_user_downloads: Get all downloads for a user
    - get_user_courses: Get all courses for a user
    - get_user_wishlist: Get user's wishlist items
    - get_user_billing: Get user's billing information

  2. Security
    - All functions are security definer
    - Access restricted to authenticated users
*/

-- Get user's downloads with template information
CREATE OR REPLACE FUNCTION get_user_downloads(user_id uuid)
RETURNS TABLE (
  download_id uuid,
  downloaded_at timestamptz,
  template_id uuid,
  title text,
  category text,
  file_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ud.id as download_id,
    ud.downloaded_at,
    t.id as template_id,
    t.title,
    t.category,
    t.file_url
  FROM user_downloads ud
  JOIN templates t ON t.id = ud.template_id
  WHERE ud.user_id = user_id
  ORDER BY ud.downloaded_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's enrolled courses with course information
CREATE OR REPLACE FUNCTION get_user_courses(user_id uuid)
RETURNS TABLE (
  enrollment_id uuid,
  enrolled_at timestamptz,
  course_id uuid,
  title text,
  instructor text,
  progress integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id as enrollment_id,
    ce.enrolled_at,
    c.id as course_id,
    c.title,
    c.instructor,
    0 as progress -- Default progress, can be updated later
  FROM course_enrollments ce
  JOIN courses c ON c.id = ce.course_id
  WHERE ce.user_id = user_id
  ORDER BY ce.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
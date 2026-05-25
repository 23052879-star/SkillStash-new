/*
  # Add Admin Policies for Content Management

  1. Security Changes
    - Add admin policies for templates table
    - Add admin policies for courses table  
    - Add admin policies for blog_posts table
    - Admin is identified by email 'admin@skillstash.com'

  2. Admin Capabilities
    - Full CRUD access to templates
    - Full CRUD access to courses
    - Full CRUD access to blog posts
    - Ability to manage all content
*/

-- Admin policies for templates table
CREATE POLICY "Admin can manage templates"
ON templates
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
);

-- Admin policies for courses table
CREATE POLICY "Admin can manage courses"
ON courses
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
);

-- Admin policies for blog_posts table
CREATE POLICY "Admin can manage blog posts"
ON blog_posts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  )
);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'skillstash.official@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create app_resources table for storing metadata of templates, apks, and tools
CREATE TABLE IF NOT EXISTS app_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL, -- 'template', 'apk', 'tool', 'document'
  file_url text NOT NULL, -- points to storage url or external link
  image_url text, -- preview image
  price numeric NOT NULL DEFAULT 0,
  downloads_count integer DEFAULT 0,
  rating numeric DEFAULT 5.0,
  size_bytes bigint,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_resources ENABLE ROW LEVEL SECURITY;

-- Select policy: viewable by everyone
CREATE POLICY "App resources are viewable by everyone"
  ON app_resources
  FOR SELECT
  TO public
  USING (true);

-- Insert/Update/Delete policies: admin only
CREATE POLICY "Admin can insert app resources"
  ON app_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'skillstash.official@gmail.com'
    )
  );

CREATE POLICY "Admin can update app resources"
  ON app_resources
  FOR UPDATE
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

CREATE POLICY "Admin can delete app resources"
  ON app_resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'skillstash.official@gmail.com'
    )
  );

-- Create a function to increment resource download count
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE app_resources
  SET downloads_count = downloads_count + 1
  WHERE id = resource_id;
END;
$$;

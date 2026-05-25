/*
  # Seed Initial Data

  1. New Functions
    - increment_downloads: Safely increment the download count for templates
    - increment_students: Safely increment the student count for courses
  
  2. Initial Data
    - Sample templates
    - Sample courses
    - Sample blog posts
*/

-- Helper functions
CREATE OR REPLACE FUNCTION increment_downloads(template_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET downloads = downloads + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_students(course_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE courses
  SET students = students + 1
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed Templates
INSERT INTO templates (title, description, category, image_url, price, downloads, rating) VALUES
('Professional Resume', 'Modern and clean resume template for professionals', 'Resume', 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg', 0, 1250, 4.9),
('Modern CV Template', 'Standout CV template with creative design', 'CV', 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg', 5, 980, 4.8),
('Creative Portfolio', 'Showcase your work with this beautiful portfolio template', 'Portfolio', 'https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg', 8, 765, 4.7),
('Technical Certificate', 'Professional certificate template for technical achievements', 'Certificate', 'https://images.pexels.com/photos/6446709/pexels-photo-6446709.jpeg', 0, 1120, 4.9);

-- Seed Courses
INSERT INTO courses (title, description, category, image_url, instructor, price, duration, level, students) VALUES
('Complete Web Development Bootcamp', 'Master web development from scratch', 'Web Development', 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg', 'Sarah Johnson', 49.99, '42 hours', 'Beginner to Advanced', 15890),
('Data Science Fundamentals', 'Learn the basics of data science and analysis', 'Data Science', 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg', 'Michael Chen', 39.99, '36 hours', 'Intermediate', 12450),
('UI/UX Design Masterclass', 'Create beautiful and user-friendly interfaces', 'Design', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg', 'Emma Roberts', 59.99, '28 hours', 'All Levels', 9780);

-- Seed Blog Posts
INSERT INTO blog_posts (title, content, excerpt, category, image_url, read_time) VALUES
('10 Essential VS Code Extensions for Web Developers', 'Full content here...', 'Boost your productivity with these must-have extensions that will transform your coding experience.', 'Development', 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg', '8 min read'),
('How to Master Responsive Design in 2025', 'Full content here...', 'Learn the latest techniques for creating responsive websites that work flawlessly across all devices.', 'Design', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', '12 min read'),
('The Ultimate Guide to TypeScript Generics', 'Full content here...', 'Demystifying TypeScript generics with practical examples to improve your code quality and reusability.', 'TypeScript', 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg', '15 min read');
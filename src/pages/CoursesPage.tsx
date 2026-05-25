import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Clock, Users, BookOpen, Search, Filter } from 'lucide-react';
import { useCoursesStore } from '../stores/coursesStore';
import { useAuthStore } from '../stores/authStore';
import { SearchModal } from '../components/shared/SearchModal';
import { CategoryFilter } from '../components/shared/CategoryFilter';

const CoursesPage: React.FC = () => {
  const { courses, fetchCourses, enrollInCourse, loading } = useCoursesStore();
  const { user } = useAuthStore();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = Array.from(new Set(courses.map(c => c.category)));

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      alert('Please sign in to enroll in courses');
      return;
    }

    try {
      await enrollInCourse(courseId, user.id);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <SectionHeading 
              title="Online Courses" 
              subtitle="Master new skills with our expert-led online courses"
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center space-x-2 flex-grow md:flex-grow-0"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-4 text-gray-600 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter by Category:</span>
          </div>
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <Card key={course.id} hover className="flex flex-col h-full overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{course.price}</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-white dark:bg-gray-800 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400 font-bold">
                      {course.instructor.charAt(0)}
                    </span>
                    By {course.instructor}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-green-500" />
                      </div>
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                      </div>
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="primary" 
                      className="w-full py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try selecting a different category or search for something else.</p>
            <Button 
              variant="link" 
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-blue-600 dark:text-blue-400"
            >
              Clear all filters
            </Button>
          </div>
        )}
        
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </Container>
    </div>
  );
};

export default CoursesPage;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, BookOpen, Tag, Loader2 } from 'lucide-react';
import { Container } from '../shared/Container';
import { SectionHeading } from '../shared/SectionHeading';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useCoursesStore } from '../../stores/coursesStore';
import { useAuthStore } from '../../stores/authStore';

const TopCourses: React.FC = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses, enrollInCourse, loading } = useCoursesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCourses();
  }, []);

  const topCourses = courses.slice(0, 3);

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
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <Container>
        <SectionHeading 
          title="Top-Rated Courses" 
          subtitle="Affordable, comprehensive courses to help you master in-demand skills"
          centered
        />
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : topCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {topCourses.map(course => (
              <Card key={course.id} hover className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-[10px] font-bold text-white">
                      {course.instructor.charAt(0)}
                    </span>
                    By {course.instructor}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <BookOpen className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{course.price}</span>
                      {course.price > 0 && (
                        <span className="ml-2 text-gray-400 line-through text-sm">₹{Math.round(course.price * 1.5)}</span>
                      )}
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="w-full"
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
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">No courses found.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="large"
            className="mx-4 sm:mx-0 text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-gray-900"
            onClick={() => navigate('/courses')}
          >
            Browse All Courses
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default TopCourses;
import React, { useEffect } from 'react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Clock, Users, Play } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';

const CoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { courses, loading, error, fetchUserCourses } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchUserCourses(user.id);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-100">My Courses</h1>
      
      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.enrollment_id} className="p-6 bg-gray-800">
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-100">{course.title}</h3>
                <p className="text-sm text-gray-300 mb-3">Instructor: {course.instructor}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Progress: {course.progress}%
                  </span>
                </div>
              </div>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Continue Course
              </Button>
            </div>
          </Card>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>You haven't enrolled in any courses yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.href = '/courses'}
            >
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/shared/Container';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useCoursesStore } from '../../stores/coursesStore';
import { CourseModal } from '../../components/admin/CourseModal';
import type { Database } from '../../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

const AdminCourses: React.FC = () => {
  const { courses, fetchCourses, createCourse, updateCourse, deleteCourse } = useCoursesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (course: Partial<Course>) => {
    await createCourse(course as Omit<Course, 'id' | 'created_at' | 'students'>);
    setIsModalOpen(false);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleUpdate = async (course: Partial<Course>) => {
    if (selectedCourse) {
      await updateCourse(selectedCourse.id, course);
      setSelectedCourse(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  const handleAddNew = () => {
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <a href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </a>
            <h1 className="text-2xl font-bold">Manage Courses</h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={course.image_url || 'https://via.placeholder.com/64'}
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-gray-600">{course.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => handleEdit(course)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <CourseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(undefined);
          }}
          onSubmit={selectedCourse ? handleUpdate : handleCreate}
          course={selectedCourse}
        />
      </Container>
    </div>
  );
};

export default AdminCourses;
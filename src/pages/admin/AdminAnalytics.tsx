import React from 'react';
import { Container } from '../../components/shared/Container';
import { Card } from '../../components/shared/Card';
import { ArrowLeft, BarChart3, TrendingUp, Users, Download, BookOpen, Eye } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const stats = [
    {
      title: 'Total Page Views',
      value: '125,430',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Template Downloads',
      value: '8,945',
      change: '+8.2%',
      changeType: 'positive',
      icon: Download,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Course Enrollments',
      value: '2,156',
      change: '+15.3%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'New Users',
      value: '1,234',
      change: '+5.7%',
      changeType: 'positive',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const topTemplates = [
    { name: 'Professional Resume', downloads: 1250, category: 'Resume' },
    { name: 'Modern CV Template', downloads: 980, category: 'CV' },
    { name: 'Creative Portfolio', downloads: 765, category: 'Portfolio' },
    { name: 'Technical Certificate', downloads: 1120, category: 'Certificate' }
  ];

  const topCourses = [
    { name: 'Complete Web Development Bootcamp', enrollments: 15890, instructor: 'Sarah Johnson' },
    { name: 'Data Science Fundamentals', enrollments: 12450, instructor: 'Michael Chen' },
    { name: 'UI/UX Design Masterclass', enrollments: 9780, instructor: 'Emma Roberts' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <a href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <ArrowLeft className="h-6 w-6" />
            </a>
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Track your platform's performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-6 bg-gradient-to-r ${stat.color} text-white border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <stat.icon className="h-8 w-8 text-white/60" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Templates */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Top Templates</h2>
            <div className="space-y-4">
              {topTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{template.downloads.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Courses */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Top Courses</h2>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{course.enrollments.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">students</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Traffic Overview */}
        <Card className="p-6 mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Traffic Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Page Views</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">125,430</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Unique Visitors</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">45,230</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Conversion Rate</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3.2%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminAnalytics;
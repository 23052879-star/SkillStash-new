import React from 'react';
import { Container } from '../../components/shared/Container';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { LayoutDashboard, BookOpen, FileText, Newspaper, LogOut, Users, BarChart3, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Courses',
      description: 'Manage your online courses',
      icon: BookOpen,
      link: '/admin/courses',
      color: 'text-blue-600'
    },
    {
      title: 'Templates',
      description: 'Manage downloadable templates',
      icon: FileText,
      link: '/admin/templates',
      color: 'text-green-600'
    },
    {
      title: 'Blog Posts',
      description: 'Manage blog content',
      icon: Newspaper,
      link: '/admin/blog',
      color: 'text-purple-600'
    },
    {
      title: 'Users',
      description: 'View and manage users',
      icon: Users,
      link: '/admin/users',
      color: 'text-orange-600'
    },
    {
      title: 'Analytics',
      description: 'View site analytics and stats',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'text-red-600'
    },
    {
      title: 'Settings',
      description: 'Configure site settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'text-gray-600'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your SKILLSTASH platform</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Templates</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <FileText className="h-8 w-8 text-green-200" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Courses</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-200" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Blog Posts</p>
                <p className="text-2xl font-bold">67</p>
              </div>
              <Newspaper className="h-8 w-8 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.title} hover className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
              <a
                href={item.link}
                className="flex flex-col items-center text-center group"
              >
                <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-8 w-8 ${item.color} dark:text-gray-300`} />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </a>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h2>
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-gray-900 dark:text-white">New user registered: john.doe@example.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-gray-900 dark:text-white">Template "Modern Resume" was downloaded</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-grow">
                  <p className="text-gray-900 dark:text-white">New course enrollment: "Web Development Bootcamp"</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">10 minutes ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
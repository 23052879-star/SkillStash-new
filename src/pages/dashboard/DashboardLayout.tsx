import React from 'react';
import { Container } from '../../components/shared/Container';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, Download, Settings, CreditCard, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/dashboard/profile'
    },
    {
      icon: Package,
      label: 'My Courses',
      path: '/dashboard/courses'
    },
    {
      icon: Download,
      label: 'My Templates',
      path: '/dashboard/templates'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      path: '/dashboard/wishlist'
    },
    {
      icon: CreditCard,
      label: 'Billing',
      path: '/dashboard/billing'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/dashboard/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome back,</h2>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 text-left
                      ${location.pathname === item.path 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardLayout;
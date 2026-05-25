import React, { useState, useEffect } from 'react';
import { Search, X, FileText, BookOpen, Gift, Newspaper, Clock, Users, Star, Download } from 'lucide-react';
import { useTemplatesStore } from '../../stores/templatesStore';
import { useCoursesStore } from '../../stores/coursesStore';
import { useBlogStore } from '../../stores/blogStore';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'template' | 'course' | 'blog' | 'tool';
  image?: string;
  price?: number;
  rating?: number;
  downloads?: number;
  students?: number;
  readTime?: string;
  instructor?: string;
  url?: string;
}

const freeTools = [
  {
    id: 'canva-pro',
    title: 'Canva Pro',
    description: 'Get 3 months of Canva Pro for free with any course purchase.',
    category: 'Design',
    type: 'tool' as const,
    image: 'https://images.pexels.com/photos/7504837/pexels-photo-7504837.jpeg',
    url: '/free-tools'
  },
  {
    id: 'notion-pro',
    title: 'Notion Personal Pro',
    description: 'One-month free subscription to organize your projects and notes.',
    category: 'Productivity',
    type: 'tool' as const,
    image: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg',
    url: '/free-tools'
  },
  {
    id: 'figma-pro',
    title: 'Figma Professional',
    description: 'Design your projects with a free 2-month Figma Professional plan.',
    category: 'Design',
    type: 'tool' as const,
    image: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg',
    url: '/free-tools'
  },
  {
    id: 'github-pro',
    title: 'GitHub Pro',
    description: 'Boost your development with a free GitHub Pro subscription.',
    category: 'Development',
    type: 'tool' as const,
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    url: '/free-tools'
  }
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { templates, fetchTemplates } = useTemplatesStore();
  const { courses, fetchCourses } = useCoursesStore();
  const { posts, fetchPosts } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchCourses();
      fetchPosts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory, templates, courses, posts]);

  const performSearch = () => {
    setIsLoading(true);
    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search templates
    if (selectedCategory === 'all' || selectedCategory === 'templates') {
      templates.forEach(template => {
        if (
          template.title.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query)
        ) {
          results.push({
            id: template.id,
            title: template.title,
            description: template.description || '',
            category: template.category,
            type: 'template',
            image: template.image_url || undefined,
            price: template.price,
            rating: template.rating,
            downloads: template.downloads
          });
        }
      });
    }

    // Search courses
    if (selectedCategory === 'all' || selectedCategory === 'courses') {
      courses.forEach(course => {
        if (
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
        ) {
          results.push({
            id: course.id,
            title: course.title,
            description: course.description || '',
            category: course.category,
            type: 'course',
            image: course.image_url || undefined,
            price: course.price,
            students: course.students,
            instructor: course.instructor
          });
        }
      });
    }

    // Search blog posts
    if (selectedCategory === 'all' || selectedCategory === 'blog') {
      posts.forEach(post => {
        if (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query)
        ) {
          results.push({
            id: post.id,
            title: post.title,
            description: post.excerpt || post.content.substring(0, 150) + '...',
            category: post.category,
            type: 'blog',
            image: post.image_url || undefined,
            readTime: post.read_time || undefined
          });
        }
      });
    }

    // Search free tools
    if (selectedCategory === 'all' || selectedCategory === 'tools') {
      freeTools.forEach(tool => {
        if (
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
        ) {
          results.push({
            id: tool.id,
            title: tool.title,
            description: tool.description,
            category: tool.category,
            type: 'tool',
            image: tool.image,
            url: tool.url
          });
        }
      });
    }

    setSearchResults(results);
    setIsLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'template':
        navigate('/templates');
        break;
      case 'course':
        navigate('/courses');
        break;
      case 'blog':
        navigate('/blog');
        break;
      case 'tool':
        navigate('/free-tools');
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'blog':
        return <Newspaper className="h-5 w-5 text-purple-500" />;
      case 'tool':
        return <Gift className="h-5 w-5 text-orange-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search SKILLSTASH</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates, courses, blog posts, tools..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'templates', label: 'Templates' },
              { key: 'courses', label: 'Courses' },
              { key: 'blog', label: 'Blog' },
              { key: 'tools', label: 'Tools' }
            ].map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search across templates, courses, blog posts, and tools</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or browse our categories</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {searchResults.map(result => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        {getResultIcon(result.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getResultIcon(result.type)}
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        {result.type}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.category}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {result.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {result.price !== undefined && (
                        <span className="flex items-center">
                          ₹{result.price}
                        </span>
                      )}
                      {result.rating && (
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          {result.rating}
                        </span>
                      )}
                      {result.downloads && (
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {result.downloads.toLocaleString()}
                        </span>
                      )}
                      {result.students && (
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {result.students.toLocaleString()}
                        </span>
                      )}
                      {result.readTime && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {result.readTime}
                        </span>
                      )}
                      {result.instructor && (
                        <span>By {result.instructor}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
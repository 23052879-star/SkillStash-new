import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { Container } from '../shared/Container';
import { SectionHeading } from '../shared/SectionHeading';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useBlogStore } from '../../stores/blogStore';

const RecentPosts: React.FC = () => {
  const navigate = useNavigate();
  const { posts, fetchPosts, loading } = useBlogStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const recentPosts = posts.slice(0, 3);

  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
      <Container>
        <SectionHeading 
          title="Latest Tech Tips" 
          subtitle="Stay updated with the latest trends and tutorials in tech"
          centered
        />
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {recentPosts.map(post => (
              <Card key={post.id} hover className="flex flex-col h-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.read_time}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-900 dark:text-gray-100">{post.title}</h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <Button 
                      variant="link"
                      className="p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center group"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Read More
                      <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-400">No recent posts found.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="large"
            className="mx-4 sm:mx-0 text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-gray-900"
            onClick={() => navigate('/blog')}
          >
            View All Articles
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default RecentPosts;
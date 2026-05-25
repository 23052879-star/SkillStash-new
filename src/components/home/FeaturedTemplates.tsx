import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ExternalLink, Star, Loader2 } from 'lucide-react';
import { Container } from '../shared/Container';
import { SectionHeading } from '../shared/SectionHeading';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useTemplatesStore } from '../../stores/templatesStore';
import { useAuthStore } from '../../stores/authStore';

const FeaturedTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { templates, fetchTemplates, downloadTemplate, loading } = useTemplatesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const featuredTemplates = templates.slice(0, 4);

  const handleDownload = async (templateId: string) => {
    if (!user) {
      alert('Please sign in to download templates');
      return;
    }

    try {
      await downloadTemplate(templateId, user.id);
      alert('Template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <SectionHeading 
              title="Featured Templates" 
              subtitle="Get started quickly with our most popular, professionally designed resume and CV templates."
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/templates')}
            className="hidden md:flex items-center"
          >
            View All Templates
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : featuredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTemplates.map(template => (
              <Card key={template.id} hover className="flex flex-col h-full group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={template.image_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop'} 
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {template.price === 0 ? 'FREE' : `$${template.price}`}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-white dark:bg-gray-800 transition-colors duration-300">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{template.category}</span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                      {template.rating}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-1">{template.title}</h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {template.downloads.toLocaleString()} downloads
                  </p>
                  
                  <div className="mt-auto flex gap-2">
                    <Button 
                      variant="primary" 
                      className="flex-1 py-2 text-sm"
                      onClick={() => handleDownload(template.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-3 py-2"
                      onClick={() => template.file_url && window.open(template.file_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <p className="text-gray-500">No templates found.</p>
          </div>
        )}
        
        <div className="text-center mt-12 md:hidden">
          <Button 
            variant="outline" 
            size="large"
            className="w-full"
            onClick={() => navigate('/templates')}
          >
            View All Templates
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedTemplates;
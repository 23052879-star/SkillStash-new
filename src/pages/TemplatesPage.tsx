import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Download, ExternalLink, Star, Search, Filter } from 'lucide-react';
import { useTemplatesStore } from '../stores/templatesStore';
import { useAuthStore } from '../stores/authStore';
import { SearchModal } from '../components/shared/SearchModal';
import { CategoryFilter } from '../components/shared/CategoryFilter';

const TemplatesPage: React.FC = () => {
  const { templates, fetchTemplates, downloadTemplate, loading } = useTemplatesStore();
  const { user } = useAuthStore();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

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
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <SectionHeading 
              title="Resume Templates" 
              subtitle="Professionally designed templates to help you land your dream job"
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
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} hover className="flex flex-col h-full group">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={template.image_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop'} 
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => handleDownload(template.id)}
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Quick Download
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-600 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
                    {template.price === 0 ? 'FREE' : `$${template.price}`}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow bg-white dark:bg-gray-800 transition-colors duration-300">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      {template.category}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                      {template.rating}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">{template.title}</h3>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {template.downloads.toLocaleString()} professionals downloaded
                  </p>
                  
                  <div className="mt-auto flex gap-2">
                    <Button 
                      variant="primary" 
                      className="flex-1 text-sm py-2"
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
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No templates found</h3>
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

export default TemplatesPage;
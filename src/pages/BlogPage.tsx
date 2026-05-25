import React from 'react';
import { useState } from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Button } from '../components/shared/Button';
import { Search } from 'lucide-react';
import { SearchModal } from '../components/shared/SearchModal';

const BlogPage: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
          <SectionHeading 
            title="Tech Blog" 
            subtitle="Stay updated with the latest trends and tutorials in tech"
          />
          <Button
            variant="outline"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Search className="h-4 w-4" />
            <span>Search Articles</span>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <p className="text-gray-600">Blog page content will go here.</p>
        </div>
        
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </Container>
    </div>
  );
};

export default BlogPage;
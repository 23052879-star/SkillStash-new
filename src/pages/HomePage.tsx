import React from 'react';
import { useState } from 'react';
import Hero from '../components/home/Hero';
import FeaturedTemplates from '../components/home/FeaturedTemplates';
import TopCourses from '../components/home/TopCourses';
import FreeTools from '../components/home/FreeTools';
import RecentPosts from '../components/home/RecentPosts';
import Newsletter from '../components/home/Newsletter';
import { SearchModal } from '../components/shared/SearchModal';

const HomePage: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div>
      <Hero onSearchClick={() => setIsSearchModalOpen(true)} />
      <FeaturedTemplates />
      <TopCourses />
      <FreeTools />
      <RecentPosts />
      <Newsletter />
      
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
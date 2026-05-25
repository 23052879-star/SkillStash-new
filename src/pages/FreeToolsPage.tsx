import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Button } from '../components/shared/Button';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { SearchModal } from '../components/shared/SearchModal';

const FreeToolsPage: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
          <SectionHeading 
            title="Free Premium Tools" 
            subtitle="Exclusive access to professional tools to boost your productivity"
          />
          <Button
            variant="outline"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Search className="h-4 w-4" />
            <span>Search Tools</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ResumeSync Tool Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg w-fit mb-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">ResumeSync</h3>
            <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6">
              Upload your resume and get a real-time ATS compatibility score. Analyze keyword matches, section breakdowns, and get actionable suggestions to improve.
            </p>
            <Link 
              to="/ats-checker"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Try for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </Container>
    </div>
  );
};

export default FreeToolsPage;
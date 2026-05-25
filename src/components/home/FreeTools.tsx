import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Gift, Check } from 'lucide-react';
import { Container } from '../shared/Container';
import { SectionHeading } from '../shared/SectionHeading';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

const tools = [
  {
    id: 1,
    title: 'Canva Pro',
    description: 'Get 3 months of Canva Pro for free with any course purchase.',
    logo: 'https://images.pexels.com/photos/7504837/pexels-photo-7504837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Pro templates & elements',
      'Background remover',
      'Magic resize tool',
      '100GB cloud storage'
    ]
  },
  {
    id: 2,
    title: 'Notion Personal Pro',
    description: 'One-month free subscription to organize your projects and notes.',
    logo: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Unlimited blocks',
      'File uploads up to 5MB',
      'Version history',
      'API access'
    ]
  },
  {
    id: 3,
    title: 'Figma Professional',
    description: 'Design your projects with a free 2-month Figma Professional plan.',
    logo: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Unlimited projects',
      'Team collaboration',
      'Advanced prototyping',
      'Plugins access'
    ]
  },
  {
    id: 4,
    title: 'GitHub Pro',
    description: 'Boost your development with a free GitHub Pro subscription.',
    logo: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Unlimited private repos',
      'Advanced code review',
      'GitHub Actions',
      'GitHub Pages'
    ]
  }
];

const FreeTools: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Container>
        <SectionHeading 
          title="Free Premium Tools" 
          subtitle="Exclusive access to professional tools to boost your productivity"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4 sm:px-0">
          {tools.map(tool => (
            <Card key={tool.id} hover className="flex flex-col h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={tool.logo} 
                      alt={tool.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tool.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                
                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Included features:</h4>
                  <ul className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-gray-900"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Free Access
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="large"
            className="mx-4 sm:mx-0 text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-gray-900"
            onClick={() => navigate('/free-tools')}
          >
            View All Free Tools
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FreeTools;
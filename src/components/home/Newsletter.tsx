import React from 'react';
import { Container } from '../shared/Container';

const Newsletter: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with SkillStash</h2>
          <p className="text-lg text-blue-100 mb-8">
            Get the latest templates, course discounts, and tech tips delivered straight to your inbox.
          </p>
          
          <form className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-0">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
                required
              />
              <button 
                type="submit" 
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm mt-3 text-blue-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
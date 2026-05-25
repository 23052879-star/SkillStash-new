import React from 'react';
import { Share2, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Share2 className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">SKILLSTASH</span>
            </div>
            <p className="text-sm">
              Your premier destination for professional resume templates, affordable online courses, 
              and free career development tools to accelerate your professional growth.
            </p>
            <div className="flex space-x-4 flex-wrap">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="/templates" className="hover:text-white transition-colors duration-300">Resume Templates</a></li>
              <li><a href="/courses" className="hover:text-white transition-colors duration-300">Online Courses</a></li>
              <li><a href="/free-tools" className="hover:text-white transition-colors duration-300">Free Tools</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors duration-300">Career Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors duration-300">Contact Support</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Career Resources</h3>
            <ul className="space-y-2">
              <li><a href="/ats-checker" className="hover:text-white transition-colors duration-300 font-bold text-blue-400">★ ATS Resume Checker</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">ATS Resume Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Interview Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Career Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Skill Assessment</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Job Search Tools</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            <div className="space-y-3 mb-4">
              <p className="text-sm">
                <strong>Email:</strong> skillstash.official@gmail.com
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> +91 7633880806
              </p>
              <p className="text-sm">
                <strong>Address:</strong> Camp, Pune, 411001
              </p>
            </div>
            <form className="space-y-2">
              <p className="text-sm mb-2">Subscribe for career tips and updates:</p>
              <div className="flex rounded-md overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-3 py-2 text-gray-900 text-sm focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 px-3 text-white hover:bg-blue-700 transition-colors duration-300"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs">We respect your privacy. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} SKILLSTASH. All rights reserved. Empowering careers worldwide.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="/privacy-policy" className="text-sm hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="/terms-of-service" className="text-sm hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-sm hover:text-white transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
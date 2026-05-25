import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { ArrowRight, Star, Users, Download, Award, Briefcase, TrendingUp, Search } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useStatsStore } from '../../stores/statsStore';

interface HeroProps {
  onSearchClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearchClick }) => {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { stats, fetchStats } = useStatsStore();

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchStats();
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [fetchStats]);

  const handleTemplatesClick = () => {
    navigate('/templates');
  };

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  return (
    <div className={`relative pt-24 pb-16 md:pb-24 overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900'
    }`}>
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-green-500/10 dark:bg-green-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

        {/* Morphing Shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 animate-morph"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-tr from-green-400 to-teal-600 opacity-15 animate-morph" style={{ animationDelay: '3s' }}></div>

        {/* Career-themed 3D floating elements with Parallax */}
        {/* Resume/Document icons */}
        <div 
          className="absolute top-20 left-10 w-16 h-20 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 rounded-lg shadow-2xl animate-float transition-transform duration-75" 
          style={{ 
            animationDelay: '0s', 
            animationDuration: '4s', 
            transform: `perspective(1000px) rotateX(${15 + mousePos.y * 10}deg) rotateY(${-15 + mousePos.x * 10}deg) translateZ(${mousePos.x * 20}px)` 
          }}
        >
          <div className="w-full h-2 bg-white opacity-30 rounded-t-lg"></div>
          <div className="p-2 space-y-1">
            <div className="h-1 bg-white opacity-40 rounded"></div>
            <div className="h-1 bg-white opacity-30 rounded w-3/4"></div>
            <div className="h-1 bg-white opacity-30 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Graduation cap */}
        <div 
          className="absolute top-40 right-20 w-20 h-16 bg-gradient-to-br from-green-400 to-green-600 opacity-25 rounded-lg shadow-2xl animate-bounce transition-transform duration-100" 
          style={{ 
            animationDelay: '1s', 
            animationDuration: '3s', 
            transform: `perspective(1000px) rotateX(${-10 + mousePos.y * 15}deg) rotateY(${20 + mousePos.x * 15}deg) translateY(${mousePos.y * 30}px)` 
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 rotate-45"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-yellow-400 opacity-60"></div>
        </div>
        
        {/* Laptop/Computer */}
        <div 
          className="absolute bottom-32 left-1/4 w-24 h-16 bg-gradient-to-br from-purple-400 to-purple-600 opacity-20 rounded-lg shadow-2xl animate-pulse transition-transform duration-150" 
          style={{ 
            animationDelay: '2s', 
            animationDuration: '4s', 
            transform: `perspective(1000px) rotateX(${25 + mousePos.y * 5}deg) rotateY(${mousePos.x * 10}deg) translate(${mousePos.x * -20}px, ${mousePos.y * -10}px)` 
          }}
        >
          <div className="w-full h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg opacity-80"></div>
          <div className="w-full h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-b-lg"></div>
        </div>
        
        {/* Certificate/Award */}
        <div 
          className="absolute top-1/3 right-1/3 w-18 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-25 rounded-lg shadow-2xl animate-spin transition-transform duration-200" 
          style={{ 
            animationDuration: '12s', 
            transform: `perspective(1000px) rotateX(${10 + mousePos.y * 20}deg) rotateY(${-10 + mousePos.x * 20}deg) scale(${1 + Math.abs(mousePos.x) * 0.1})` 
          }}
        >
          <div className="absolute top-2 left-2 right-2 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-40 rounded"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 opacity-60 rounded-full"></div>
        </div>
        
        {/* Books stack */}
        <div 
          className="absolute bottom-20 right-1/4 w-12 h-16 opacity-20 animate-float transition-transform duration-150" 
          style={{ 
            animationDelay: '3s', 
            animationDuration: '5s', 
            transform: `perspective(1000px) rotateY(${25 + mousePos.x * 30}deg) translateZ(${mousePos.y * 40}px)` 
          }}
        >
          <div className="w-full h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-sm mb-1 shadow-lg"></div>
          <div className="w-full h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-sm mb-1 shadow-lg"></div>
          <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-sm mb-1 shadow-lg"></div>
          <div className="w-full h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-sm shadow-lg"></div>
        </div>
        
        {/* Target/Goal icon */}
        <div 
          className="absolute top-1/2 left-1/6 w-16 h-16 opacity-15 animate-ping transition-transform duration-300" 
          style={{ 
            animationDelay: '1.5s', 
            animationDuration: '4s',
            transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`
          }}
        >
          <div className="w-full h-full border-4 border-blue-400 rounded-full relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-500 rounded-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced gradient orbs with career colors */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-xl animate-pulse" style={{ animationDuration: '6s', transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}></div>
        <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-green-500/15 to-blue-500/10 blur-2xl animate-bounce" style={{ animationDuration: '7s', transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-gradient-to-bl from-orange-500/25 to-red-500/15 blur-lg animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s', transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}></div>
        
        {/* Career-themed floating particles */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-green-400 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/6 right-1/2 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 md:space-y-12">
            {/* Main heading with enhanced SEO keywords */}
            <div className="animate-fade-in">
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8 drop-shadow-2xl transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'
                  : 'text-blue-900'
              }`}>
                Professional Resume Templates & Career Development Courses Online
              </h1>
              <p className={`mt-8 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto font-medium tracking-wide transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Download premium CV templates, enroll in affordable skill development courses, and access free productivity tools. Boost your career with expert-designed resources trusted by professionals worldwide. Get hired faster with our ATS-friendly resume templates and industry-leading online courses.
              </p>
            </div>
            
            {/* Enhanced trust indicators with real metrics */}
            <div className={`flex flex-wrap justify-center items-center gap-6 md:gap-8 animate-slide-up transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`} style={{ animationDelay: '0.3s' }}>
              <div className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 border-white/20'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <Users className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">{stats.totalUsers.toLocaleString()}+ Job Seekers</span>
              </div>
              <div className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 border-white/20'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <Download className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">{stats.totalDownloads.toLocaleString()}+ Downloads</span>
              </div>
              <div className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 border-white/20'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-sm md:text-base">{stats.averageRating}/5 Rating</span>
              </div>
              <div className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 border-white/20'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <Award className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">Industry Certified</span>
              </div>
            </div>
            
            {/* CTA buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-slide-up px-4 sm:px-0" style={{ animationDelay: '0.6s' }}>
              <Button 
                variant="primary" 
                size="large" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto group border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl relative"
                onClick={() => navigate('/ats-checker')}
              >
                <span className="absolute -top-2 -right-2 bg-pink-500 text-[9px] text-white px-2 py-0.5 rounded-full font-bold animate-pulse">AI POWERED</span>
                Check ATS Score
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="secondary" 
                size="large" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto group border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl"
                onClick={handleTemplatesClick}
              >
                Browse Resume Templates
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="secondary" 
                size="large" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl backdrop-blur-sm"
                onClick={handleCoursesClick}
              >
                Explore Online Courses
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {/* Search Button */}
              {onSearchClick && (
                <Button 
                  variant="secondary" 
                  size="large" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl border-0"
                  onClick={onSearchClick}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Everything
                </Button>
              )}
            </div>
            
            {/* Enhanced SEO keywords section */}
            <div className={`pt-8 text-sm animate-fade-in transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`} style={{ animationDelay: '0.9s' }}>
              <p className={`mb-6 font-semibold text-sm sm:text-base px-4 sm:px-0 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Specializing in Career Growth & Professional Development:</p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-white/20'
                    : 'bg-blue-100 border-blue-300'
                }`}>ATS Resume Templates</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-green-500/30 to-blue-500/30 border-white/20'
                    : 'bg-green-100 border-green-300'
                }`}>Professional CV Design</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/20'
                    : 'bg-purple-100 border-purple-300'
                }`}>Career Development Courses</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border-white/20'
                    : 'bg-orange-100 border-orange-300'
                }`}>Online Learning Platform</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-white/20'
                    : 'bg-yellow-100 border-yellow-300'
                }`}>Skill Enhancement</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-teal-500/30 to-green-500/30 border-white/20'
                    : 'bg-teal-100 border-teal-300'
                }`}>Job Search Tools</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-white/20'
                    : 'bg-indigo-100 border-indigo-300'
                }`}>Interview Preparation</span>
                <span className={`px-4 py-2 rounded-full backdrop-blur-md font-medium hover:scale-105 transition-transform duration-300 border ${
                  isDark
                    ? 'bg-gradient-to-r from-pink-500/30 to-red-500/30 border-white/20'
                    : 'bg-pink-100 border-pink-300'
                }`}>Professional Certification</span>
              </div>
            </div>

            {/* Additional value proposition */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className={`flex flex-wrap justify-center items-center gap-6 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-sm">Land Your Dream Job</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Advance Your Career</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Get Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Enhanced wave shape divider with 3D effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? '#111827' : '#f9fafb'} stopOpacity="0.9"/>
              <stop offset="50%" stopColor={isDark ? '#111827' : '#f9fafb'} stopOpacity="1"/>
              <stop offset="100%" stopColor={isDark ? '#111827' : '#f9fafb'} stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 50C840 40 960 20 1080 15C1200 10 1320 20 1380 25L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="url(#waveGradient)"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
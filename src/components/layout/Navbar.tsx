import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Share2, LogOut, User, Search, Moon, Sun, LayoutDashboard, Sparkles, Coins } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthModal } from '../auth/AuthModal';
import { SearchModal } from '../shared/SearchModal';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useUserStore } from '../../stores/userStore';
import { CheckoutModal } from '../payment/CheckoutModal';
import { supabase } from '../../lib/supabase';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name?: string } | null>(null);
  const { user, setUser, signOut } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { credits } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    (async () => {
      // Set initial user state
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      setUser(initialUser);
      
      if (initialUser) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', initialUser.id)
          .single();
        setUserProfile(profile);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when user signs in
          const { data: profile } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', session.user.id)
            .single();
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      });

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription.unsubscribe();
      };
    })();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserProfile(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2 border-b border-gray-200 dark:border-gray-700' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <RouterLink to="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <img src="/logo.png" alt="Skillstash Logo" className="h-10 w-10 object-contain rounded-lg shadow-lg" />
              </div>
              <span className={`ml-3 text-xl font-bold transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-900 dark:text-white' 
                  : (isDark ? 'text-white' : 'text-gray-900')
              }`}>SKILLSTASH</span>
            </RouterLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <RouterLink to="/" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Home</RouterLink>
            <RouterLink to="/templates" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Templates</RouterLink>
            <RouterLink to="/courses" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Courses</RouterLink>
            <RouterLink to="/free-tools" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Free Tools</RouterLink>
            <RouterLink to="/ats-checker" className="relative group px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>ATS Checker</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
            </RouterLink>
            <RouterLink to="/blog" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Blog</RouterLink>
            <RouterLink to="/about" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>About</RouterLink>
            <RouterLink to="/contact" className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
            }`}>Contact</RouterLink>
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : (isDark ? 'text-white hover:text-blue-200 hover:bg-white/10' : 'text-gray-700 hover:text-blue-600 hover:bg-black/5')
              }`}
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : (isDark ? 'text-white hover:text-blue-200 hover:bg-white/10' : 'text-gray-700 hover:text-blue-600 hover:bg-black/5')
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                {/* Credit balance display */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-black shadow-sm transition-all"
                  title="Your AI Tailoring Credits"
                >
                  <Coins className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                  <span>{credits} Credits</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex items-center space-x-2 transition-colors duration-300 ${
                      scrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' 
                        : (isDark ? 'text-white hover:text-blue-200' : 'text-gray-700 hover:text-blue-600')
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>{userProfile?.full_name || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                      <RouterLink
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </RouterLink>
                      <RouterLink
                        to="/dashboard/billing"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Coins className="h-4 w-4 mr-2 text-amber-500" />
                        Billing & Credits
                      </RouterLink>
                    {user.email === 'skillstash.official@gmail.com' && (
                      <RouterLink
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Admin Panel
                      </RouterLink>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <RouterLink 
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </RouterLink>
            )}
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className={`focus:outline-none transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-700 dark:text-white' 
                  : (isDark ? 'text-white' : 'text-gray-700')
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <RouterLink to="/" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Home</RouterLink>
            <RouterLink to="/templates" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Templates</RouterLink>
            <RouterLink to="/courses" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Courses</RouterLink>
            <RouterLink to="/free-tools" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Free Tools</RouterLink>
            <RouterLink to="/ats-checker" className="flex items-center gap-1.5 px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md font-bold transition-all duration-300 shadow-md hover:shadow-lg" onClick={() => setIsMenuOpen(false)}>
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
              <span>ATS Score Checker</span>
            </RouterLink>
            <RouterLink to="/blog" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Blog</RouterLink>
            <RouterLink to="/about" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">About</RouterLink>
            <RouterLink to="/contact" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact</RouterLink>
            
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setIsSearchModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {isDark ? (
                <>
                  <Sun className="h-5 w-5 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
            
            {user ? (
              <>
                <RouterLink
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </RouterLink>
                {user.email === 'skillstash.official@gmail.com' && (
                  <RouterLink
                    to="/admin"
                    className="block px-3 py-2 text-blue-600 dark:text-blue-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </RouterLink>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <RouterLink 
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </RouterLink>
            )}
          </div>
        </div>
      )}
      
      
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
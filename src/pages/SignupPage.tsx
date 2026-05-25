import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/shared/Button';
import { Container } from '../components/shared/Container';
import { Card } from '../components/shared/Card';
import { Mail, Lock, ArrowLeft, Loader2, Share2, User as UserIcon, Chrome, Github } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signInWithGoogle, verifyOtp } = useAuthStore();

  const handleBack = () => {
    if (authStep === 'verify') {
      setAuthStep('signup');
    } else {
      navigate('/');
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (authStep === 'verify') {
        await verifyOtp(otp);
        navigate('/dashboard');
        return;
      }

      await signUp(email, password, fullName);
      setAuthStep('verify');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      if (message.includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait a few minutes before trying again or check your spam folder for previous emails.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google signup failed';
      if (message.includes('provider_not_enabled')) {
        setError('Google sign-up is not enabled in the Supabase Dashboard. Please enable it under Authentication > Providers.');
      } else {
        setError(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <Container className="max-w-md relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <Link to="/" className="inline-flex items-center group mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Share2 className="h-7 w-7 text-white" />
            </div>
            <span className="ml-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">SKILLSTASH</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Start your journey with professional tools</p>
        </div>

        <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl animate-slide-up">
          {authStep === 'signup' ? (
            <div className="space-y-6">
              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-xl"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <Chrome className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm font-semibold">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-xl"
                  disabled={loading}
                >
                  <Github className="h-5 w-5 mr-2 text-gray-900 dark:text-white" />
                  <span className="text-sm font-semibold">GitHub</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 font-medium tracking-wider">Or register with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 ml-1">Must be at least 6 characters.</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm animate-pulse">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 transform active:scale-95 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : 'Create Account'}
                </Button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
              <div className="flex items-center mb-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Email</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enter the verification code sent to <strong>{email}</strong>.
              </p>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] font-black placeholder-gray-300 dark:placeholder-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="000000"
                  required
                  maxLength={6}
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm animate-pulse">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : 'Verify & Complete'}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-600">
          <Link to="/privacy-policy" className="hover:text-gray-900 dark:hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-gray-900 dark:hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-gray-900 dark:hover:text-gray-400 transition-colors">Help Center</Link>
        </div>
      </Container>
    </div>
  );
};

export default SignupPage;

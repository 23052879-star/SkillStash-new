import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/shared/Button';
import { Container } from '../components/shared/Container';
import { Card } from '../components/shared/Card';
import { Mail, ArrowLeft, Loader2, Share2, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <Container className="max-w-md relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <Link to="/" className="inline-flex items-center group mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Share2 className="h-7 w-7 text-white" />
            </div>
            <span className="ml-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">SKILLSTASH</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">We'll send you a link to get back into your account</p>
        </div>

        <Card className="p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl animate-slide-up">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    Sending link...
                  </div>
                ) : 'Send Reset Link'}
              </Button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Check your email</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full py-4 rounded-xl font-bold"
                onClick={() => navigate('/login')}
              >
                Return to Login
              </Button>
              <p className="text-xs text-gray-500">
                Didn't receive the email? <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold hover:underline">Try again</button>
              </p>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;

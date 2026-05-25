import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../shared/Button';
import { X, Mail, Phone, ArrowLeft, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'email' | 'phone';
type AuthStep = 'method' | 'signup' | 'signin' | 'verify';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [authStep, setAuthStep] = useState<AuthStep>('method');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, verifyOtp } = useAuthStore();
  
  if (!isOpen) return null;

  const handleBack = () => {
    if (authStep === 'verify') {
      setAuthStep(authMethod === 'email' ? 'signup' : 'signin');
    } else if (authStep === 'signup' || authStep === 'signin') {
      setAuthStep('method');
    }
    setError(null);
  };

  const validatePhone = (phone: string) => {
    try {
      return isValidPhoneNumber(phone) ? parsePhoneNumber(phone).format('E.164') : null;
    } catch {
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (authStep === 'verify') {
        await verifyOtp(otp);
        onClose();
        return;
      }

      if (authMethod === 'email') {
        if (authStep === 'signup') {
          await signUp(email, password, fullName);
          setAuthStep('verify');
        } else {
          await signIn(email, password);
          onClose();
        }
      } else {
        const formattedPhone = validatePhone(phone);
        if (!formattedPhone) {
          throw new Error('Please enter a valid phone number with country code');
        }
        await signIn(formattedPhone);
        setAuthStep('verify');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2 text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Welcome to SkillStash</h2>
        <p className="text-gray-400">Join thousands of professionals growing their careers</p>
      </div>
      
      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 border-white/10 text-white py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => {
            setAuthMethod('email');
            setAuthStep('signin');
          }}
        >
          <Mail className="h-5 w-5 mr-3 text-blue-400" />
          Continue with Email
        </Button>
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 border-white/10 text-white py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => {
            setAuthMethod('phone');
            setAuthStep('signin');
          }}
        >
          <Phone className="h-5 w-5 mr-3 text-green-400" />
          Continue with Phone
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-500 font-medium">New to SkillStash?</span>
        </div>
      </div>
      
      <Button
        variant="primary"
        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
        onClick={() => {
          setAuthMethod('email');
          setAuthStep('signup');
        }}
      >
        Create Free Account
      </Button>
    </div>
  );

  const renderEmailForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">
          {authStep === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h2>
      </div>

      {authStep === 'signup' && (
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
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
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>
      
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transform active:scale-95 transition-all"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </div>
        ) : (authStep === 'signup' ? 'Sign Up' : 'Sign In')}
      </Button>

      <p className="text-center text-sm text-gray-400">
        {authStep === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setAuthStep(authStep === 'signup' ? 'signin' : 'signup')}
          className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
        >
          {authStep === 'signup' ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </form>
  );

  const renderPhoneForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">Sign In with Phone</h2>
      </div>
      
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 ml-1">Include country code (e.g., +91 for India)</p>
      </div>
      
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transform active:scale-95 transition-all"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Sending code...
          </div>
        ) : 'Send Verification Code'}
      </Button>
    </form>
  );

  const renderVerificationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">Verify Your Identity</h2>
      </div>
      
      <p className="text-gray-400 text-sm">
        We've sent a 6-digit verification code to your {authMethod === 'email' ? 'email' : 'phone'}.
      </p>
      
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Verification Code
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-center text-2xl tracking-[1em] font-black placeholder-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
          placeholder="000000"
          required
          maxLength={6}
        />
      </div>
      
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transform active:scale-95 transition-all"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Verifying...
          </div>
        ) : 'Verify & Continue'}
      </Button>
      
      <p className="text-center text-xs text-gray-500">
        Didn't receive the code? <button type="button" className="text-blue-400 font-bold hover:underline">Resend</button>
      </p>
    </form>
  );
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        {authStep === 'method' && renderMethodSelection()}
        {authStep === 'verify' && renderVerificationForm()}
        {authStep !== 'method' && authStep !== 'verify' && (
          authMethod === 'email' ? renderEmailForm() : renderPhoneForm()
        )}
      </div>
    </div>
  );
};
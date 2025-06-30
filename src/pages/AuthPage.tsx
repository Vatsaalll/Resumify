import React, { useState, useEffect } from 'react';
import { Mail, Lock, Github, Chrome, ArrowRight, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setMessage({ type: 'error', text: 'Full name is required' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setMessage({ 
            type: 'error', 
            text: error.message || 'Failed to sign in. Please check your credentials.' 
          });
        } else {
          setMessage({ type: 'success', text: 'Successfully signed in!' });
          // Navigation will happen automatically via useEffect
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          setMessage({ 
            type: 'error', 
            text: error.message || 'Failed to create account. Please try again.' 
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully! Please check your email to verify your account.' 
          });
          // Switch to login mode after successful signup
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          }, 2000);
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setMessage(null);
  };

  return (
    <div className="min-h-screen pt-16 px-4 flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-400">
            {isLogin 
              ? 'Sign in to continue optimizing your resume' 
              : 'Join thousands of professionals who boosted their careers'
            }
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'error' 
              ? 'bg-red-900/20 border-red-800 text-red-300' 
              : 'bg-green-900/20 border-green-800 text-green-300'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5 mr-3 text-blue-500" />
            Continue with Google
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </button>
          
          <button 
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 shadow-lg"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 shadow-lg"
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 shadow-lg"
                  placeholder="Confirm your password"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-600 text-gray-500 focus:ring-gray-500 bg-gray-800" 
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-sm text-gray-400 hover:text-gray-300 hover:underline"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <span className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={toggleMode}
            disabled={loading}
            className="text-gray-300 font-semibold hover:text-gray-100 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        {/* Terms */}
        {!isLogin && (
          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300 hover:underline">Privacy Policy</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
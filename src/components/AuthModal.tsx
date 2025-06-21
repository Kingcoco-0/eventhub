import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp } = useAuth();

  // Check connection status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      setConnectionStatus(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      console.warn('Connection check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForm();
    }
  }, [isOpen, initialMode]);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setIsSubmitting(false);
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (mode === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;

    // Check connection before submitting
    if (connectionStatus === 'disconnected') {
      setErrors({ general: 'No internet connection. Please check your network and try again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName
        );
      }

      if (result.success) {
        if (result.error) {
          // This is for cases like email confirmation required
          setSuccessMessage(result.error);
        } else {
          // Successful authentication
          onClose();
          resetForm();
        }
      } else {
        setErrors({ general: result.error || 'An error occurred' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Connection timeout. Please check your internet and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            {/* Connection Status */}
            <div className="flex items-center mt-1 text-sm">
              {connectionStatus === 'checking' ? (
                <div className="flex items-center text-gray-400">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Checking connection...
                </div>
              ) : connectionStatus === 'connected' ? (
                <div className="flex items-center text-green-400">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Connection issues
                  <button 
                    onClick={checkConnection}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => switchMode('signin')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              mode === 'signin'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              mode === 'signup'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Sign Up Fields */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="John"
                    autoComplete="given-name"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    placeholder="Doe"
                    autoComplete="family-name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="john@example.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
            {mode === 'signup' && (
              <p className="text-gray-400 text-xs mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Forgot Password Link (Sign In only) */}
          {mode === 'signin' && (
            <div className="text-right">
              <button
                type="button"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                disabled={isSubmitting}
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || connectionStatus === 'disconnected'}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Connection Warning */}
          {connectionStatus === 'disconnected' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start space-x-2">
              <WifiOff className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 text-sm font-medium">Connection Issues</p>
                <p className="text-yellow-300 text-xs mt-1">
                  Please check your internet connection and try again.
                </p>
              </div>
            </div>
          )}

          {/* Additional Info for Sign Up */}
          {mode === 'signup' && (
            <p className="text-gray-400 text-xs text-center">
              By creating an account, you agree to our{' '}
              <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                Privacy Policy
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
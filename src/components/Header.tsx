import React, { useState } from 'react';
import { Sparkles, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { isAuthenticated } = useAuth();

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Event<span className="text-purple-400">Hub</span>
              </h1>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
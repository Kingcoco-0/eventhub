import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Heart, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user.avatar ? (
            <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            getInitials(user.firstName, user.lastName)
          )}
        </div>
        <span className="hidden md:block font-medium">{user.firstName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  getInitials(user.firstName, user.lastName)
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <User className="w-4 h-4 mr-3" />
              Profile Settings
            </button>
            
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <Calendar className="w-4 h-4 mr-3" />
              My Events
            </button>
            
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <Heart className="w-4 h-4 mr-3" />
              Saved Vendors
            </button>
            
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-700 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
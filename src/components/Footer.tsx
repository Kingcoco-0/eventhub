import React from 'react';
import { Sparkles, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Event<span className="text-purple-400">Hub</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your premier destination for event planning with AI-powered assistance. 
              Connecting you with top-rated vendors to create unforgettable experiences.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <Heart className="w-4 h-4 text-red-400 mr-2" />
              Made with love for perfect events
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#vendors" className="text-gray-300 hover:text-purple-400 transition-colors">Browse Vendors</a></li>
              <li><a href="#categories" className="text-gray-300 hover:text-purple-400 transition-colors">Categories</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</a></li>
              <li><a href="#support" className="text-gray-300 hover:text-purple-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-sm">hello@eventhub.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-sm">New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} EventHub. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Sparkles, Calendar, Users, Heart } from 'lucide-react';

interface HeroProps {
  onBrowseVendors: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBrowseVendors }) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzk5MzNGRiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Plan Your Perfect Event with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {' '}AI Assistance
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover top-rated event vendors, get AI-powered planning assistance, and create unforgettable experiences for every occasion.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors transform hover:scale-105">
            Start Planning Now
          </button>
          <button 
            onClick={onBrowseVendors}
            className="px-8 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold rounded-lg transition-colors"
          >
            Browse Vendors
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-gray-400">Vendors</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-gray-400">Events</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Heart className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">4.9</div>
            <div className="text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-gray-400">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, XCircle, Heart } from 'lucide-react';
import { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
  onContact: (vendor: Vendor) => void;
  onViewDetails: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onContact, onViewDetails }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'photographer': return '📸';
      case 'caterer': return '🍽️';
      case 'decorator': return '🎨';
      case 'event-organizer': return '📋';
      case 'souvenir-provider': return '🎁';
      case 'entertainment': return '🎵';
      case 'venue': return '🏛️';
      default: return '⭐';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-purple-500/50">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={vendor.images[0]} 
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-purple-600/90 text-white text-sm rounded-full backdrop-blur-sm">
            {getCategoryIcon(vendor.category)} {formatCategory(vendor.category)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-gray-900/80 rounded-full hover:bg-purple-600/80 transition-colors backdrop-blur-sm">
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="absolute bottom-4 right-4">
          {vendor.availability ? (
            <div className="flex items-center px-2 py-1 bg-green-600/90 text-white text-xs rounded-full backdrop-blur-sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              Available
            </div>
          ) : (
            <div className="flex items-center px-2 py-1 bg-red-600/90 text-white text-xs rounded-full backdrop-blur-sm">
              <XCircle className="w-3 h-3 mr-1" />
              Busy
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {vendor.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white font-semibold">{vendor.rating}</span>
            <span className="text-gray-400 text-sm">({vendor.reviewCount})</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {vendor.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            {vendor.location}
          </div>
          <div className="text-purple-400 font-semibold">
            {vendor.priceRange}
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {vendor.eventTypes.slice(0, 3).map(type => (
              <span 
                key={type} 
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
            {vendor.eventTypes.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                +{vendor.eventTypes.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-1">
            {vendor.specialties.slice(0, 2).map(specialty => (
              <span 
                key={specialty} 
                className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onContact(vendor)}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Contact
          </button>
          <button 
            onClick={() => onViewDetails(vendor)}
            className="px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-medium rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Quick Contact Icons */}
        <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-700">
          <a 
            href={`tel:${vendor.contact.phone}`}
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a 
            href={`mailto:${vendor.contact.email}`}
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
          {vendor.contact.website && (
            <a 
              href={`https://${vendor.contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
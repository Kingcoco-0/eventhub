import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Heart,
  Calendar,
  DollarSign,
  Users,
  Award,
  MessageCircle,
  Share2,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Vendor } from '../types';

interface VendorDetailsProps {
  vendor: Vendor;
  onBack: () => void;
  onContact: (vendor: Vendor) => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onBack, onContact }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vendor.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vendor.portfolio.length - 1 : prev - 1
    );
  };

  // Sample reviews data
  const sampleReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely amazing service! They exceeded all our expectations and made our wedding day perfect.',
      event: 'Wedding'
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 5,
      date: '2024-01-10',
      comment: 'Professional, creative, and reliable. Highly recommend for any special event.',
      event: 'Corporate Event'
    },
    {
      id: '3',
      name: 'Emily Davis',
      rating: 4,
      date: '2024-01-05',
      comment: 'Great quality work and excellent communication throughout the planning process.',
      event: 'Birthday Party'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Vendors
            </button>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={vendor.portfolio[currentImageIndex] || vendor.images[0]} 
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {vendor.portfolio.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {vendor.portfolio.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Overlay Info */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-600/90 text-white text-sm rounded-full backdrop-blur-sm">
                    {getCategoryIcon(vendor.category)} {formatCategory(vendor.category)}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4">
                  {vendor.availability ? (
                    <div className="flex items-center px-3 py-1 bg-green-600/90 text-white text-sm rounded-full backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Available
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1 bg-red-600/90 text-white text-sm rounded-full backdrop-blur-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Busy
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{vendor.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-purple-400" />
                        {vendor.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-purple-400" />
                        {vendor.priceRange}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-xl font-bold text-white">{vendor.rating}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {vendor.reviewCount} reviews
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  {vendor.description}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 rounded-xl">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'portfolio', label: 'Portfolio' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {vendor.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full border border-purple-600/30"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Event Types */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Event Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {vendor.eventTypes.map((type, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Services Offered</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          Professional consultation
                        </div>
                        <div className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          Custom packages available
                        </div>
                        <div className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          On-site coordination
                        </div>
                        <div className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          Emergency support
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Portfolio Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vendor.portfolio.map((image, index) => (
                        <div 
                          key={index}
                          className="relative group cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img 
                            src={image} 
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
                    <div className="space-y-4">
                      {sampleReviews.map((review) => (
                        <div key={review.id} className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{review.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>{review.event}</span>
                                <span>•</span>
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <a 
                  href={`tel:${vendor.contact.phone}`}
                  className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-3 text-purple-400" />
                  {vendor.contact.phone}
                </a>
                
                <a 
                  href={`mailto:${vendor.contact.email}`}
                  className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-3 text-purple-400" />
                  {vendor.contact.email}
                </a>
                
                {vendor.contact.website && (
                  <a 
                    href={`https://${vendor.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <Globe className="w-5 h-5 mr-3 text-purple-400" />
                    {vendor.contact.website}
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => onContact(vendor)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Vendor
                </button>
                
                <button className="w-full px-4 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold rounded-lg transition-colors">
                  Request Quote
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Rating
                  </div>
                  <span className="text-white font-semibold">{vendor.rating}/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    Reviews
                  </div>
                  <span className="text-white font-semibold">{vendor.reviewCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-2 text-green-400" />
                    Availability
                  </div>
                  <span className={`font-semibold ${vendor.availability ? 'text-green-400' : 'text-red-400'}`}>
                    {vendor.availability ? 'Available' : 'Busy'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <Award className="w-5 h-5 mr-2 text-purple-400" />
                    Experience
                  </div>
                  <span className="text-white font-semibold">5+ years</span>
                </div>
              </div>
            </div>

            {/* Similar Vendors */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Similar Vendors</h3>
              <div className="text-gray-400 text-sm">
                Discover other {formatCategory(vendor.category).toLowerCase()}s in your area
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                View Similar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
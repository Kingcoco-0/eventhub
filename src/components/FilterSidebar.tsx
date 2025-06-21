import React from 'react';
import { Filter, MapPin, DollarSign, Star, Calendar } from 'lucide-react';
import { FilterState, VendorCategory, EventType } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  setFilters, 
  isOpen, 
  setIsOpen 
}) => {
  const categories: { value: VendorCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'photographer', label: 'Photographers' },
    { value: 'caterer', label: 'Caterers' },
    { value: 'decorator', label: 'Decorators' },
    { value: 'event-organizer', label: 'Event Organizers' },
    { value: 'souvenir-provider', label: 'Souvenir Providers' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'venue', label: 'Venues' }
  ];

  const eventTypes: { value: EventType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'wedding', label: 'Weddings' },
    { value: 'birthday', label: 'Birthdays' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'anniversary', label: 'Anniversaries' },
    { value: 'graduation', label: 'Graduations' },
    { value: 'baby-shower', label: 'Baby Showers' },
    { value: 'engagement', label: 'Engagements' }
  ];

  const priceRanges = [
    'All Prices',
    '$0 - $500',
    '$500 - $1,500',
    '$1,500 - $5,000',
    '$5,000 - $15,000',
    '$15,000+'
  ];

  const locations = [
    'All Locations',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Miami, FL',
    'Austin, TX',
    'Seattle, WA'
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-64 
        bg-gray-800 border-r border-gray-700 z-40 lg:z-auto transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto lg:mt-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:justify-start">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-300 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                Category
              </h3>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  category: e.target.value as VendorCategory | 'all' 
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-300 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h3>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-300 mb-3">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Range
              </h3>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-300 mb-3">
                <Star className="w-4 h-4 mr-2" />
                Minimum Rating
              </h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                  <label key={rating} className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        rating: parseFloat(e.target.value) 
                      })}
                      className="mr-2 text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Event Type Filter */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-300 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                Event Type
              </h3>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  eventType: e.target.value as EventType | 'all' 
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    availability: e.target.checked 
                  })}
                  className="mr-2 text-purple-500 focus:ring-purple-500"
                />
                Available Only
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                category: 'all',
                location: 'All Locations',
                priceRange: 'All Prices',
                rating: 0,
                eventType: 'all',
                availability: false
              })}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
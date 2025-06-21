import React from 'react';
import { Filter } from 'lucide-react';
import { Vendor, FilterState } from '../types';
import VendorCard from './VendorCard';
import VendorListItem from './VendorListItem';

interface VendorListProps {
  vendors: Vendor[];
  filters: FilterState;
  searchQuery: string;
  onOpenFilters: () => void;
  onContact: (vendor: Vendor) => void;
  onViewDetails: (vendor: Vendor) => void;
  viewMode?: 'grid' | 'list';
}

const VendorList: React.FC<VendorListProps> = ({ 
  vendors, 
  filters, 
  searchQuery, 
  onOpenFilters, 
  onContact,
  onViewDetails,
  viewMode = 'grid'
}) => {
  const filteredVendors = vendors.filter(vendor => {
    // Search filter
    if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && vendor.category !== filters.category) {
      return false;
    }

    // Location filter
    if (filters.location !== 'All Locations' && vendor.location !== filters.location) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && vendor.rating < filters.rating) {
      return false;
    }

    // Event type filter
    if (filters.eventType !== 'all' && !vendor.eventTypes.includes(filters.eventType)) {
      return false;
    }

    // Availability filter
    if (filters.availability && !vendor.availability) {
      return false;
    }

    return true;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    // Sort by availability first (available vendors first)
    if (a.availability !== b.availability) {
      return b.availability ? 1 : -1;
    }
    // Then by rating (highest first)
    return b.rating - a.rating;
  });

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Event Vendors
          </h2>
          <p className="text-gray-400">
            {sortedVendors.length} vendor{sortedVendors.length !== 1 ? 's' : ''} found
            {searchQuery && (
              <span className="ml-2">
                for "<span className="text-purple-400">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>
        
        <button 
          onClick={onOpenFilters}
          className="lg:hidden flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Active Filters */}
      {(filters.category !== 'all' || filters.location !== 'All Locations' || 
        filters.rating > 0 || filters.eventType !== 'all' || filters.availability) && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                {filters.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            )}
            {filters.location !== 'All Locations' && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                {filters.location}
              </span>
            )}
            {filters.rating > 0 && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                {filters.rating}+ Stars
              </span>
            )}
            {filters.eventType !== 'all' && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                {filters.eventType.charAt(0).toUpperCase() + filters.eventType.slice(1)}
              </span>
            )}
            {filters.availability && (
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                Available Only
              </span>
            )}
          </div>
        </div>
      )}

      {/* Vendor Grid/List */}
      {sortedVendors.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedVendors.map(vendor => (
              <VendorCard 
                key={vendor.id} 
                vendor={vendor} 
                onContact={onContact}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedVendors.map(vendor => (
              <VendorListItem 
                key={vendor.id} 
                vendor={vendor} 
                onContact={onContact}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            {searchQuery 
              ? `No vendors found matching "${searchQuery}"`
              : "No vendors found matching your criteria"
            }
          </div>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? "Try a different search term or adjust your filters"
              : "Try adjusting your filters or search terms"
            }
          </p>
          {(filters.category !== 'all' || filters.location !== 'All Locations' || 
            filters.rating > 0 || filters.eventType !== 'all' || filters.availability) && (
            <button
              onClick={() => {
                // Clear all filters
                const clearFilters = {
                  category: 'all' as const,
                  location: 'All Locations',
                  priceRange: 'All Prices',
                  rating: 0,
                  eventType: 'all' as const,
                  availability: false
                };
                // This would need to be passed down as a prop
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorList;
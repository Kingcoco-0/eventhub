import React, { useState } from 'react';
import { ArrowLeft, Grid, List, SlidersHorizontal } from 'lucide-react';
import { FilterState, Vendor } from '../types';
import VendorList from './VendorList';
import FilterSidebar from './FilterSidebar';
import { sampleVendors } from '../data/vendors';

interface VendorsPageProps {
  searchQuery: string;
  onBack: () => void;
  onContact: (vendor: Vendor) => void;
  onViewDetails: (vendor: Vendor) => void;
}

const VendorsPage: React.FC<VendorsPageProps> = ({ 
  searchQuery, 
  onBack, 
  onContact,
  onViewDetails
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    location: 'All Locations',
    priceRange: 'All Prices',
    rating: 0,
    eventType: 'all',
    availability: false
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleOpenFilters = () => {
    setFiltersOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-2xl font-bold text-white">All Vendors</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filters Button */}
              <button
                onClick={handleOpenFilters}
                className="lg:hidden flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar 
            filters={filters}
            setFilters={setFilters}
            isOpen={filtersOpen}
            setIsOpen={setFiltersOpen}
          />
          
          {/* Vendor List */}
          <VendorList 
            vendors={sampleVendors}
            filters={filters}
            searchQuery={searchQuery}
            onOpenFilters={handleOpenFilters}
            onContact={onContact}
            onViewDetails={onViewDetails}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
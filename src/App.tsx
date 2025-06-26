import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PlatformPreview from './components/PlatformPreview';
import VendorsPage from './components/VendorsPage';
import VendorDetails from './components/VendorDetails';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import { Vendor } from './types';

function App() {
  // Search and navigation state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'vendors' | 'vendor-details' | 'chat-assistant'>('home');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle vendor contact - now just shows contact info
  const handleVendorContact = useCallback((vendor: Vendor) => {
    // Show contact information directly or redirect to contact form
    window.open(`mailto:${vendor.contact.email}?subject=Event Inquiry - ${vendor.name}`, '_blank');
  }, []);

  // Handle browse vendors action
  const handleBrowseVendors = useCallback(() => {
    setCurrentPage('vendors');
  }, []);

  // Handle back to home
  const handleBackToHome = useCallback(() => {
    setCurrentPage('home');
    setSelectedVendor(null);
  }, []);

  // Handle back to vendors
  const handleBackToVendors = useCallback(() => {
    setCurrentPage('vendors');
    setSelectedVendor(null);
  }, []);

  // Handle view vendor details
  const handleViewVendorDetails = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentPage('vendor-details');
  }, []);

  // Handle choose chat assistant
  const handleChooseChatAssistant = useCallback(() => {
    setCurrentPage('chat-assistant');
  }, []);

  // Handle back from chat assistant
  const handleBackFromChatAssistant = useCallback(() => {
    setCurrentPage('home');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {currentPage === 'home' ? (
        <>
          <Hero onBrowseVendors={handleBrowseVendors} />
          <PlatformPreview 
            onBrowseVendors={handleBrowseVendors}
            onChooseChat={handleChooseChatAssistant}
          />
          <Footer />
        </>
      ) : currentPage === 'vendors' ? (
        <VendorsPage
          searchQuery={searchQuery}
          onBack={handleBackToHome}
          onContact={handleVendorContact}
          onViewDetails={handleViewVendorDetails}
        />
      ) : currentPage === 'vendor-details' && selectedVendor ? (
        <VendorDetails
          vendor={selectedVendor}
          onBack={handleBackToVendors}
          onContact={handleVendorContact}
        />
      ) : currentPage === 'chat-assistant' ? (
        <ChatAssistant
          onBack={handleBackFromChatAssistant}
        />
      ) : null}
    </div>
  );
}

export default App;
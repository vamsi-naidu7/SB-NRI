"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Home, BedDouble, Bath, Square, ShieldCheck, ChevronDown } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';

interface PropertyCatalogProps {
  onViewProperty?: (propertyId: string) => void;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return (
      <>
        <span className="text-[#C7A36A]">₹</span>
        {(price / 10000000).toFixed(2)} Cr
      </>
    );
  }
  return (
    <>
      <span className="text-[#C7A36A]">₹</span>
      {(price / 100000).toFixed(2)} Lakhs
    </>
  );
};

export default function PropertyCatalog({ onViewProperty }: PropertyCatalogProps) {
  const { properties, addVerificationRequest } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [city, setCity] = useState('All');
  
  const [verifyingProperty, setVerifyingProperty] = useState<string | null>(null);

  const uniqueCities = useMemo(() => Array.from(new Set(properties.map(p => p.city))), [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = propertyType === 'All' || p.type === propertyType;
      const matchesCity = city === 'All' || p.city === city;
      
      let matchesPrice = true;
      if (priceRange === 'Under ₹50L') matchesPrice = p.price < 5000000;
      else if (priceRange === '₹50L-1Cr') matchesPrice = p.price >= 5000000 && p.price < 10000000;
      else if (priceRange === '₹1Cr-5Cr') matchesPrice = p.price >= 10000000 && p.price <= 50000000;
      else if (priceRange === 'Above ₹5Cr') matchesPrice = p.price > 50000000;

      let matchesBeds = true;
      if (bedrooms === '1') matchesBeds = p.bedrooms === 1;
      else if (bedrooms === '2') matchesBeds = p.bedrooms === 2;
      else if (bedrooms === '3') matchesBeds = p.bedrooms === 3;
      else if (bedrooms === '4+') matchesBeds = p.bedrooms >= 4;

      return matchesSearch && matchesType && matchesCity && matchesPrice && matchesBeds;
    });
  }, [properties, searchTerm, propertyType, priceRange, bedrooms, city]);

  const handleVerify = () => {
    if (verifyingProperty) {
      const property = properties.find(p => p.id === verifyingProperty);
      if (property) {
        addVerificationRequest({
          id: `vr-${Date.now()}`,
          propertyId: property.id,
          propertyTitle: property.title,
          propertyAddress: property.address,
          propertyImage: property.images[0] || '',
          isExternal: false,
          nriId: 'nri-1',
          nriName: 'Rajesh Sharma',
          nriEmail: 'rajesh@email.com',
          assignedRmId: 'rm-1',
          assignedRmName: 'Priya Verma',
          status: 'Submitted',
          dateSubmitted: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        });
      }
      setVerifyingProperty(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-stretch md:items-center">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A36A] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, city, address..." 
            className="w-full bg-white border border-[#E8DFD6] rounded-full py-2.5 sm:py-3 pl-11 pr-4 text-sm text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] shadow-2xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto">
          <select className="bg-white border border-[#E8DFD6] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] cursor-pointer shadow-2xs" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Commercial">Commercial</option>
          </select>
          <select className="bg-white border border-[#E8DFD6] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] cursor-pointer shadow-2xs" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
            <option value="All">All Prices</option>
            <option value="Under ₹50L">Under ₹50L</option>
            <option value="₹50L-1Cr">₹50L-1Cr</option>
            <option value="₹1Cr-5Cr">₹1Cr-5Cr</option>
            <option value="Above ₹5Cr">Above ₹5Cr</option>
          </select>
          <select className="bg-white border border-[#E8DFD6] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] cursor-pointer shadow-2xs" value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
            <option value="All">All Beds</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4+">4+ Beds</option>
          </select>
          <select className="bg-white border border-[#E8DFD6] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] cursor-pointer shadow-2xs" value={city} onChange={e => setCity(e.target.value)}>
            <option value="All">All Cities</option>
            {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="text-[#4A5568] text-sm">
        Found {filteredProperties.length} properties
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <AnimatePresence>
          {filteredProperties.map(property => (
            <motion.div
              key={property.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 w-full bg-[#FAF6EF]">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-[#E8DFD6]" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-[#E8DFD6] text-[#2C3E38] text-xs rounded-full font-bold">
                    {property.type}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-2xl font-bold text-[#2C3E38] mb-1">
                  {formatPrice(property.price)}
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E38] mb-2 line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-[#4A5568] text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1 shrink-0 text-[#C7A36A]" />
                  <span className="truncate">{property.city}, {property.state}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-[#E8DFD6]">
                  <div className="flex flex-col items-center justify-center text-[#4A5568]">
                    <BedDouble className="w-4 h-4 mb-1 text-[#C7A36A]" />
                    <span className="text-xs">{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-[#4A5568] border-l border-r border-[#E8DFD6]">
                    <Bath className="w-4 h-4 mb-1 text-[#C7A36A]" />
                    <span className="text-xs">{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-[#4A5568]">
                    <Square className="w-4 h-4 mb-1 text-[#C7A36A]" />
                    <span className="text-xs">{property.builtUpAreaSqFt} sqft</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {property.amenities?.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#FAF6EF] rounded-full text-xs text-[#4A5568]">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities && property.amenities.length > 3 && (
                    <span className="px-3 py-1 bg-[#FAF6EF] rounded-full text-xs text-[#4A5568]">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onViewProperty?.(property.id)}
                    className="py-2.5 rounded-full border border-[#C7A36A] text-[#C7A36A] hover:bg-[#FAF6EF] text-sm font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setVerifyingProperty(property.id)}
                    className="py-2.5 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C7A36A]" />
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal isOpen={!!verifyingProperty} onClose={() => setVerifyingProperty(null)} title="Request Property Verification">
        <div className="p-4 space-y-4 text-[#4A5568]">
          <p>You are about to request a comprehensive verification for this property. A dedicated Relationship Manager will be assigned to handle this process.</p>
          <p className="text-sm font-semibold text-[#2C3E38]">The verification includes:</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Title deed and ownership checks</li>
            <li>Physical site inspection</li>
            <li>Local authority approvals check</li>
            <li>Market valuation assessment</li>
          </ul>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setVerifyingProperty(null)}
              className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]"
            >
              Cancel
            </button>
            <button 
              onClick={handleVerify}
              className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold hover:bg-[#2C3E38]/90"
            >
              Confirm Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

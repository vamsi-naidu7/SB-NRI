"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Property } from '@/types';
import { 
  Building, MapPin, Ruler, Image as ImageIcon, 
  CheckSquare, User, Plus, X, Upload 
} from 'lucide-react';

const AMENITIES_LIST = [
  "Gated Security", "24/7 Power Backup", "Swimming Pool", "Gymnasium", 
  "Club House", "Children's Play Area", "Landscaped Gardens", "EV Charging Station", 
  "Covered Parking", "Rainwater Harvesting", "Solar Panels", "Jogging Track", 
  "Indoor Games", "Concierge Service", "CCTV Surveillance", "Intercom Facility"
];

export default function UploadProperty() {
  const { addProperty, addActivityLog, addNotification } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment',
    price: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    googleMapUrl: '',
    plotAreaSqFt: '',
    builtUpAreaSqFt: '',
    bedrooms: '',
    bathrooms: '',
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
  });

  const [images, setImages] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>(['']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleMediaChange = (index: number, value: string, type: 'images' | 'videos') => {
    if (type === 'images') {
      const newImages = [...images];
      newImages[index] = value;
      setImages(newImages);
    } else {
      const newVideos = [...videos];
      newVideos[index] = value;
      setVideos(newVideos);
    }
  };

  const addMediaField = (type: 'images' | 'videos') => {
    if (type === 'images') setImages(prev => [...prev, '']);
    else setVideos(prev => [...prev, '']);
  };

  const removeMediaField = (index: number, type: 'images' | 'videos') => {
    if (type === 'images') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.title) newErrors.title = true;
    if (!formData.price) newErrors.price = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status: 'Draft' | 'Listed') => {
    if (!validateForm()) {
      addNotification({
        id: Date.now().toString(),
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        type: 'error',
        role: 'agent',
        read: false,
        createdAt: new Date().toISOString()
      });
      return;
    }

    setIsSubmitting(true);

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: formData.title,
      type: formData.type as any,
      price: Number(formData.price),
      currency: 'INR',
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      googleMapUrl: formData.googleMapUrl,
      description: formData.description,
      images: images.filter(img => img.trim() !== ''),
      videos: videos.filter(vid => vid.trim() !== ''),
      plotAreaSqFt: Number(formData.plotAreaSqFt) || 0,
      builtUpAreaSqFt: Number(formData.builtUpAreaSqFt) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      amenities: selectedAmenities,
      ownerDetails: {
        name: formData.ownerName,
        contact: formData.ownerContact,
        email: formData.ownerEmail
      },
      agentId: 'agent-1',
      agentName: 'Jane Smith',
      status: status,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addProperty(newProperty);
      addActivityLog({
        id: Date.now().toString(),
        user: 'agent-1',
        role: 'agent',
        action: `Property ${status === 'Draft' ? 'saved as draft' : 'listed'}`,
        description: `${formData.title} has been ${status.toLowerCase()}.`,
        timestamp: new Date().toISOString()
      });
      addNotification({
        id: Date.now().toString(),
        title: 'Success',
        message: `Property ${status === 'Draft' ? 'saved as draft' : 'published successfully'}!`,
        type: 'success',
        role: 'agent',
        read: false,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setFormData({
        title: '', type: 'Apartment', price: '', description: '',
        address: '', city: '', state: '', pincode: '', googleMapUrl: '',
        plotAreaSqFt: '', builtUpAreaSqFt: '', bedrooms: '', bathrooms: '',
        ownerName: '', ownerContact: '', ownerEmail: '',
      });
      setImages(['']);
      setVideos(['']);
      setSelectedAmenities([]);
      setIsSubmitting(false);
    }, 800);
  };

  const inputClasses = (name: string) => `w-full bg-white border ${errors[name] ? 'border-red-500' : 'border-[#E8DFD6]'} rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#2C3E38] placeholder:text-[#4A5568]/50 focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A]/25 outline-none transition`;
  const labelClasses = "text-xs sm:text-sm font-semibold text-[#4A5568] mb-1.5 block";
  const sectionClasses = "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6";
  const sectionHeaderClasses = "flex items-center gap-2.5 text-lg sm:text-xl font-bold text-[#2C3E38] mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#E8DFD6]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-[#2C3E38] mb-2">Upload Property</h1>
        <p className="text-[#4A5568]">List a new property to your portfolio</p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <Building className="text-[#C7A36A]" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClasses}>Property Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={inputClasses('title')} placeholder="e.g. Luxury 3BHK in Koregaon Park" />
            </div>
            <div>
              <label className={labelClasses}>Property Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className={inputClasses('type')}>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={inputClasses('price')} placeholder="e.g. 25000000" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className={inputClasses('description')} placeholder="Detailed description of the property..."></textarea>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <MapPin className="text-[#C7A36A]" /> Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClasses}>Full Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={inputClasses('address')} placeholder="123 Street Name, Area" />
            </div>
            <div>
              <label className={labelClasses}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClasses('city')} placeholder="e.g. Pune" />
            </div>
            <div>
              <label className={labelClasses}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputClasses('state')} placeholder="e.g. Maharashtra" />
            </div>
            <div>
              <label className={labelClasses}>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={inputClasses('pincode')} placeholder="e.g. 411001" />
            </div>
            <div>
              <label className={labelClasses}>Google Maps URL</label>
              <input type="url" name="googleMapUrl" value={formData.googleMapUrl} onChange={handleInputChange} className={inputClasses('googleMapUrl')} placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </div>

        {/* Structural Details */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <Ruler className="text-[#C7A36A]" /> Structural Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClasses}>Plot Area (sq ft)</label>
              <input type="number" name="plotAreaSqFt" value={formData.plotAreaSqFt} onChange={handleInputChange} className={inputClasses('plotAreaSqFt')} />
            </div>
            <div>
              <label className={labelClasses}>Built-up Area (sq ft)</label>
              <input type="number" name="builtUpAreaSqFt" value={formData.builtUpAreaSqFt} onChange={handleInputChange} className={inputClasses('builtUpAreaSqFt')} />
            </div>
            <div>
              <label className={labelClasses}>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className={inputClasses('bedrooms')} />
            </div>
            <div>
              <label className={labelClasses}>Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className={inputClasses('bathrooms')} />
            </div>
          </div>
        </div>

        {/* Visual Media */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <ImageIcon className="text-[#C7A36A]" /> Visual Media
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Image URLs</label>
              <div className="space-y-3">
                {images.map((url, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input 
                        type="url" 
                        value={url} 
                        onChange={(e) => handleMediaChange(idx, e.target.value, 'images')}
                        className={inputClasses('')} 
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {url && (
                      <div className="w-12 h-12 rounded-xl border border-[#E8DFD6] overflow-hidden shrink-0 bg-[#FAF6EF]">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeMediaField(idx, 'images')}
                      className="p-3 text-[#4A5568] hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addMediaField('images')}
                  className="flex items-center gap-2 text-sm text-[#C7A36A] hover:text-[#2C3E38] mt-2 font-medium"
                >
                  <Plus size={16} /> Add Image URL
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Video URLs</label>
              <div className="space-y-3">
                {videos.map((url, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input 
                      type="url" 
                      value={url} 
                      onChange={(e) => handleMediaChange(idx, e.target.value, 'videos')}
                      className={inputClasses('')} 
                      placeholder="https://youtube.com/..."
                    />
                    <button 
                      type="button" 
                      onClick={() => removeMediaField(idx, 'videos')}
                      className="p-3 text-[#4A5568] hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addMediaField('videos')}
                  className="flex items-center gap-2 text-sm text-[#C7A36A] hover:text-[#2C3E38] mt-2 font-medium"
                >
                  <Plus size={16} /> Add Video URL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Checklist */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <CheckSquare className="text-[#C7A36A]" /> Amenities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
            {AMENITIES_LIST.map(amenity => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <div 
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? 'bg-[#FAF6EF] border-[#C7A36A]' 
                      : 'bg-white border-[#E8DFD6] hover:border-[#C7A36A]/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-[#C7A36A] border-[#C7A36A]' : 'border-[#E8DFD6] bg-white'
                  }`}>
                    {isSelected && <CheckSquare size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-[#2C3E38] font-bold' : 'text-[#4A5568] font-medium'}`}>
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Owner Details */}
        <div className={sectionClasses}>
          <h2 className={sectionHeaderClasses}>
            <User className="text-[#C7A36A]" /> Owner Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClasses}>Owner Full Name</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={inputClasses('ownerName')} />
            </div>
            <div>
              <label className={labelClasses}>Contact Number</label>
              <input type="tel" name="ownerContact" value={formData.ownerContact} onChange={handleInputChange} className={inputClasses('ownerContact')} />
            </div>
            <div>
              <label className={labelClasses}>Email Address</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className={inputClasses('ownerEmail')} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Draft')}
            className="w-full sm:w-auto px-6 py-3 rounded-full font-medium border border-[#E8DFD6] text-[#4A5568] hover:bg-[#FAF6EF] transition disabled:opacity-50 text-center text-sm"
          >
            Save as Draft
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Listed')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium bg-[#2C3E38] text-white hover:bg-[#2C3E38]/90 transition shadow-md disabled:opacity-50 text-sm"
          >
            <Upload size={18} />
            Publish Listing
          </button>
        </div>
      </div>
    </motion.div>
  );
}

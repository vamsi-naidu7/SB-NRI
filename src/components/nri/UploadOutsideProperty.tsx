"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function UploadOutsideProperty() {
  const { addVerificationRequest } = useApp();
  
  const [formData, setFormData] = useState({
    title: '', address: '', city: '', state: '', pincode: '',
    sellerName: '', sellerContact: '', sellerEmail: '',
    notes: '', photoUrl1: '', photoUrl2: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate property creation and verification request
    addVerificationRequest({
      id: `ext-${Date.now()}`,
      propertyTitle: formData.title,
      propertyAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      isExternal: true,
      outsidePropertyDetails: {
        id: `ext-det-${Date.now()}`,
        title: formData.title,
        nriId: 'nri-1',
        address: formData.address,
        city: formData.city,
        sellerDetails: {
          name: formData.sellerName,
          contact: formData.sellerContact,
          email: formData.sellerEmail
        },
        documents: [],
        images: [formData.photoUrl1, formData.photoUrl2].filter(Boolean),
        notes: formData.notes
      },
      nriId: 'nri-1',
      nriName: 'Rajesh Sharma',
      nriEmail: 'rajesh@email.com',
      assignedRmId: 'rm-1',
      assignedRmName: 'Priya Verma',
      status: 'Submitted',
      dateSubmitted: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        title: '', address: '', city: '', state: '', pincode: '',
        sellerName: '', sellerContact: '', sellerEmail: '',
        notes: '', photoUrl1: '', photoUrl2: ''
      });
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1 sm:mb-2">Verify External Property</h1>
        <p className="text-xs sm:text-sm text-[#4A5568]">Found a property outside SiteBank? Upload details here to initiate a full background verification.</p>
      </div>

      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#FAF6EF] border border-[#C7A36A]/30 flex flex-col items-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#2C3E38]/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#2C3E38]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E38] mb-2">Request Submitted Successfully!</h2>
          <p className="text-xs sm:text-sm text-[#4A5568]">Your Relationship Manager has been notified and will begin the verification process shortly.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C7A36A]" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Property Title / Name</label>
                <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="e.g. Godrej Woods Phase 2, Apt 402" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Full Address</label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">State</label>
                <input required name="state" value={formData.state} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Pincode</label>
                <input required name="pincode" value={formData.pincode} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 space-y-6">
            <h2 className="text-xl font-bold text-[#2C3E38]">Seller / Builder Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Seller Name</label>
                <input name="sellerName" value={formData.sellerName} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Contact Number</label>
                <input name="sellerContact" value={formData.sellerContact} onChange={handleChange} type="text" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Email Address</label>
                <input name="sellerEmail" value={formData.sellerEmail} onChange={handleChange} type="email" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 space-y-6">
            <h2 className="text-xl font-bold text-[#2C3E38]">Additional Documents & Info</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#2C3E38] mb-2">Notes or Specific Concerns</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="Any specific details you want the RM to check?"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#2C3E38] mb-2">Photo / Document URL 1</label>
                  <input name="photoUrl1" value={formData.photoUrl1} onChange={handleChange} type="url" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2C3E38] mb-2">Photo / Document URL 2</label>
                  <input name="photoUrl2" value={formData.photoUrl2} onChange={handleChange} type="url" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white text-sm font-semibold transition-colors shadow-md">
              <Upload className="w-4 h-4 text-[#C7A36A]" />
              Submit for Verification
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

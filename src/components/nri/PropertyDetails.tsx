"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, ExternalLink, CheckCircle, ShieldCheck, Wrench, FileText, BedDouble, Bath, Square, Home, Scale, Calculator, Check } from 'lucide-react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { createDefaultCheckpoints } from '@/data/checkpoints';
import { VerificationCheckpoint } from '@/types';

interface PropertyDetailsProps {
  propertyId: string;
  onBack?: () => void;
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

export default function PropertyDetails({ propertyId, onBack }: PropertyDetailsProps) {
  const { properties, addVerificationRequest, addMaintenanceRequest, addLeaseRequest } = useApp();
  const property = properties.find(p => p.id === propertyId);

  const [verifyModal, setVerifyModal] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [leaseModal, setLeaseModal] = useState(false);
  
  const [maintenanceReq, setMaintenanceReq] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('12');
  const [leaseRent, setLeaseRent] = useState('');

  // Checkpoint state
  const [checkpoints, setCheckpoints] = useState<VerificationCheckpoint[]>(() => createDefaultCheckpoints());

  const toggleCheckpoint = (id: string) => {
    setCheckpoints(prev => prev.map(cp => cp.id === id ? { ...cp, selected: !cp.selected } : cp));
  };

  const selectAllCategory = (category: 'legal' | 'financial', selected: boolean) => {
    setCheckpoints(prev => prev.map(cp => cp.category === category ? { ...cp, selected } : cp));
  };

  if (!property) return <div className="text-[#2C3E38] p-8">Property not found</div>;

  const legalCheckpoints = checkpoints.filter(cp => cp.category === 'legal');
  const financialCheckpoints = checkpoints.filter(cp => cp.category === 'financial');
  const selectedCount = checkpoints.filter(cp => cp.selected).length;

  const handleVerify = () => {
    const selectedCheckpoints = checkpoints.filter(cp => cp.selected);
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
      checkpoints: selectedCheckpoints,
      dateSubmitted: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    });
    setVerifyModal(false);
    setCheckpoints(createDefaultCheckpoints());
  };

  const handleMaintenance = () => {
    addMaintenanceRequest({
      id: `mr-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      propertyImage: property.images[0] || '',
      nriId: 'nri-1',
      nriName: 'Rajesh Sharma',
      requirements: maintenanceReq,
      assignedRmId: 'rm-1',
      assignedRmName: 'Priya Verma',
      status: 'Active',
      monthlyInspections: [],
      emergencyInspections: [],
      createdAt: new Date().toISOString(),
    });
    setMaintenanceModal(false);
  };

  const handleLease = () => {
    addLeaseRequest({ 
      id: `lr-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      propertyImage: property.images[0] || '',
      nriId: 'nri-1',
      nriName: 'Rajesh Sharma',
      leaseDurationMonths: parseInt(leaseDuration), 
      expectedMonthlyRent: parseInt(leaseRent) || property.price * 0.003,
      specialConditions: '',
      occupancyType: 'Long Term Rental',
      assignedRmId: 'rm-1',
      assignedRmName: 'Priya Verma',
      status: 'Requested', 
      monthlyRentPayouts: [],
      createdAt: new Date().toISOString(),
    });
    setLeaseModal(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50">
          <ImageCarousel images={property.images || []} alt={property.title} />
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5">
              <span className="px-3 py-1 bg-[#FAF6EF] text-[#2C3E38] border border-[#E8DFD6] text-xs sm:text-sm rounded-full font-bold">
                {property.type}
              </span>
              <StatusBadge status={property.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1.5 leading-snug">{property.title}</h1>
            <div className="text-3xl sm:text-4xl font-bold text-[#2C3E38] mb-3">{formatPrice(property.price)}</div>
            
            <div className="flex items-start text-[#4A5568] text-xs sm:text-sm">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 mt-0.5 text-[#C7A36A] shrink-0" />
              <span className="leading-normal">{property.address}, {property.city}, {property.state} - {property.pincode}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50">
            <div className="flex flex-col items-center">
              <BedDouble className="w-5 h-5 sm:w-6 sm:h-6 text-[#C7A36A] mb-1" />
              <span className="text-[#2C3E38] font-bold text-sm sm:text-base">{property.bedrooms}</span>
              <span className="text-[11px] sm:text-xs text-[#4A5568]">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center border-l border-[#E8DFD6]/50 sm:border-l-0">
              <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-[#C7A36A] mb-1" />
              <span className="text-[#2C3E38] font-bold text-sm sm:text-base">{property.bathrooms}</span>
              <span className="text-[11px] sm:text-xs text-[#4A5568]">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center border-t border-[#E8DFD6]/50 sm:border-t-0 pt-2 sm:pt-0">
              <Square className="w-5 h-5 sm:w-6 sm:h-6 text-[#C7A36A] mb-1" />
              <span className="text-[#2C3E38] font-bold text-sm sm:text-base">{property.builtUpAreaSqFt}</span>
              <span className="text-[11px] sm:text-xs text-[#4A5568]">Sq. Ft.</span>
            </div>
            <div className="flex flex-col items-center border-t border-l border-[#E8DFD6]/50 sm:border-t-0 sm:border-l-0 pt-2 sm:pt-0">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[#C7A36A] mb-1" />
              <span className="text-[#2C3E38] font-bold text-sm sm:text-base">{property.status === 'Listed' ? 'Ready' : 'In Use'}</span>
              <span className="text-[11px] sm:text-xs text-[#4A5568]">Status</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <button onClick={() => setVerifyModal(true)} className="flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white font-semibold text-sm sm:text-base transition-colors shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#C7A36A]" />
              Request Verification
            </button>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button onClick={() => setMaintenanceModal(true)} className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold text-xs sm:text-sm hover:bg-[#FAF6EF] transition-colors">
                <Wrench className="w-4 h-4 text-[#C7A36A]" />
                Maintenance
              </button>
              <button onClick={() => setLeaseModal(true)} className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold text-xs sm:text-sm hover:bg-[#FAF6EF] transition-colors">
                <FileText className="w-4 h-4 text-[#C7A36A]" />
                Submit Lease
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50">
            <h3 className="text-xl font-bold text-[#2C3E38] mb-4">Description</h3>
            <p className="text-[#4A5568] leading-relaxed">
              {property.description || 'No description provided for this property.'}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50">
            <h3 className="text-xl font-bold text-[#2C3E38] mb-4">Structural Details</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <span className="text-[#4A5568] block">Property Type</span>
                <span className="text-[#2C3E38] font-bold">{property.type}</span>
              </div>
              <div>
                <span className="text-[#4A5568] block">Plot Area</span>
                <span className="text-[#2C3E38] font-bold">{property.plotAreaSqFt ? `${property.plotAreaSqFt} Sq. Ft.` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#4A5568] block">Built Up Area</span>
                <span className="text-[#2C3E38] font-bold">{property.builtUpAreaSqFt ? `${property.builtUpAreaSqFt} Sq. Ft.` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#4A5568] block">Status</span>
                <span className="text-[#2C3E38] font-bold">{property.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50">
            <h3 className="text-xl font-bold text-[#2C3E38] mb-4">Amenities</h3>
            <div className="space-y-3">
              {property.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center text-[#4A5568]">
                  <CheckCircle className="w-5 h-5 text-[#C7A36A] mr-3 shrink-0" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
              {(!property.amenities || property.amenities.length === 0) && (
                <p className="text-[#4A5568]">No amenities listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={verifyModal} onClose={() => setVerifyModal(false)} title="Select Verification Checkpoints" size="lg">
        <div className="space-y-5">
          <p className="text-sm text-[#4A5568]">
            Select which verification checkpoints you'd like for <span className="font-bold text-[#2C3E38]">{property.title}</span>. 
            Legal checkpoints are reviewed by our <span className="font-semibold text-[#6366f1]">Lawyer</span> and financial checkpoints by our <span className="font-semibold text-[#0891b2]">Chartered Accountant</span>.
          </p>

          {/* Legal Checkpoints */}
          <div className="rounded-xl border border-[#6366f1]/20 overflow-hidden">
            <div className="bg-[#6366f1]/5 px-4 py-3 flex items-center justify-between border-b border-[#6366f1]/20">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#6366f1]" />
                <span className="text-sm font-bold text-[#2C3E38]">Legal Checkpoints</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-medium">→ Lawyer</span>
              </div>
              <button
                onClick={() => {
                  const allSelected = legalCheckpoints.every(cp => cp.selected);
                  selectAllCategory('legal', !allSelected);
                }}
                className="text-xs font-medium text-[#6366f1] hover:text-[#6366f1]/80 transition-colors"
              >
                {legalCheckpoints.every(cp => cp.selected) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="divide-y divide-[#E8DFD6]/50">
              {legalCheckpoints.map(cp => (
                <button
                  key={cp.id}
                  onClick={() => toggleCheckpoint(cp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    cp.selected ? 'bg-[#6366f1]/5' : 'bg-white hover:bg-[#FAF6EF]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    cp.selected ? 'bg-[#6366f1] border-[#6366f1]' : 'border-[#E8DFD6]'
                  }`}>
                    {cp.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C3E38]">{cp.name}</p>
                    <p className="text-xs text-[#4A5568]">{cp.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Financial Checkpoints */}
          <div className="rounded-xl border border-[#0891b2]/20 overflow-hidden">
            <div className="bg-[#0891b2]/5 px-4 py-3 flex items-center justify-between border-b border-[#0891b2]/20">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0891b2]" />
                <span className="text-sm font-bold text-[#2C3E38]">Financial Checkpoints</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#0891b2]/10 text-[#0891b2] font-medium">→ Chartered Accountant</span>
              </div>
              <button
                onClick={() => {
                  const allSelected = financialCheckpoints.every(cp => cp.selected);
                  selectAllCategory('financial', !allSelected);
                }}
                className="text-xs font-medium text-[#0891b2] hover:text-[#0891b2]/80 transition-colors"
              >
                {financialCheckpoints.every(cp => cp.selected) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="divide-y divide-[#E8DFD6]/50">
              {financialCheckpoints.map(cp => (
                <button
                  key={cp.id}
                  onClick={() => toggleCheckpoint(cp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    cp.selected ? 'bg-[#0891b2]/5' : 'bg-white hover:bg-[#FAF6EF]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    cp.selected ? 'bg-[#0891b2] border-[#0891b2]' : 'border-[#E8DFD6]'
                  }`}>
                    {cp.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C3E38]">{cp.name}</p>
                    <p className="text-xs text-[#4A5568]">{cp.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary + Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E8DFD6]">
            <div className="text-sm text-[#4A5568]">
              <span className="font-bold text-[#2C3E38]">{selectedCount}</span> of {checkpoints.length} checkpoints selected
            </div>
            <div className="flex gap-3">
              <button onClick={() => setVerifyModal(false)} className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]">Cancel</button>
              <button
                onClick={handleVerify}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send for Verification
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={maintenanceModal} onClose={() => setMaintenanceModal(false)} title="Request Maintenance">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Maintenance Requirements</label>
            <textarea 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl p-4 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-32"
              placeholder="Describe the issues or requirements..."
              value={maintenanceReq}
              onChange={e => setMaintenanceReq(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setMaintenanceModal(false)} className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]">Cancel</button>
            <button onClick={handleMaintenance} className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold">Submit Request</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={leaseModal} onClose={() => setLeaseModal(false)} title="Submit for Lease">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Duration (Months)</label>
            <input type="number" className="w-full bg-white border border-[#E8DFD6] rounded-xl p-4 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" value={leaseDuration} onChange={e => setLeaseDuration(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Expected Rent (₹/month)</label>
            <input type="number" className="w-full bg-white border border-[#E8DFD6] rounded-xl p-4 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" value={leaseRent} onChange={e => setLeaseRent(e.target.value)} placeholder="e.g. 25000" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setLeaseModal(false)} className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]">Cancel</button>
            <button onClick={handleLease} className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold">Submit Request</button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
}

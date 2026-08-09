"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { FileText, Download, Calendar, DollarSign, Home, AlertCircle } from 'lucide-react';

export default function LeaseManagement() {
  const { leaseRequests, properties, addLeaseRequest } = useApp();
  const [newLeaseModal, setNewLeaseModal] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: '',
    duration: '12',
    expectedRent: '',
    occupancyType: 'Long Term Rental',
    conditions: ''
  });

  const myProperties = properties; // Mock: all properties available

  const handleSubmit = () => {
    if (formData.propertyId && formData.expectedRent) {
      const property = properties.find(p => p.id === formData.propertyId);
      if (property) {
        addLeaseRequest({
          id: `lr-${Date.now()}`,
          propertyId: formData.propertyId,
          propertyTitle: property.title,
          propertyAddress: property.address,
          propertyImage: property.images[0] || '',
          nriId: 'nri-1',
          nriName: 'Rajesh Sharma',
          leaseDurationMonths: parseInt(formData.duration),
          expectedMonthlyRent: parseInt(formData.expectedRent),
          specialConditions: formData.conditions,
          occupancyType: formData.occupancyType as 'Long Term Rental' | 'Serviced Apartment' | 'Airbnb / Short Term',
          assignedRmId: 'rm-1',
          assignedRmName: 'Priya Verma',
          status: 'Requested',
          monthlyRentPayouts: [],
          createdAt: new Date().toISOString()
        });
      }
      setNewLeaseModal(false);
      setFormData({ propertyId: '', duration: '12', expectedRent: '', occupancyType: 'Long Term Rental', conditions: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Lease & Tenant Management</h1>
          <p className="text-xs sm:text-sm text-[#4A5568]">Monitor your active leases, track rent payouts, and manage renewals.</p>
        </div>
        <button 
          onClick={() => setNewLeaseModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shadow-md shrink-0"
        >
          <Home className="w-4 h-4 text-[#C7A36A]" />
          Submit for Lease
        </button>
      </div>

      <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        <AnimatePresence>
          {leaseRequests.map(req => {
            const prop = properties.find(p => p.id === req.propertyId);
            return (
              <motion.div key={req.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 overflow-hidden p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge status={req.status} />
                          {req.status === 'Renewal Due' && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                              <AlertCircle className="w-3 h-3" /> Action Required
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-[#2C3E38]">{prop?.title || 'Unknown Property'}</h3>
                        <p className="text-sm text-[#4A5568] mt-1 font-medium">{prop?.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2C3E38]"><span className="text-[#C7A36A]">₹</span>{req.expectedMonthlyRent.toLocaleString()} <span className="text-sm font-bold text-[#4A5568]">/mo</span></div>
                        <div className="text-sm text-[#4A5568] font-bold">{req.leaseDurationMonths} Months Lease</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E8DFD6]">
                      <div className="bg-[#FAF6EF] rounded-xl p-3 border border-[#E8DFD6] flex items-center gap-3 pr-6">
                        <div className="p-2 rounded-lg bg-white shadow-sm text-[#C7A36A]"><Home className="w-4 h-4" /></div>
                        <div>
                          <div className="text-xs font-bold text-[#4A5568]">Occupancy Type</div>
                          <div className="text-sm font-bold text-[#2C3E38]">Long Term Rental</div>
                        </div>
                      </div>
                      
                      {(req.status === 'Active' || req.status === 'Renewal Due') && (
                        <button className="bg-[#FAF6EF] rounded-xl p-3 border border-[#E8DFD6] flex items-center gap-3 pr-6 hover:bg-white hover:shadow-md transition-all">
                          <div className="p-2 rounded-lg bg-white shadow-sm text-[#C7A36A]"><FileText className="w-4 h-4" /></div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-[#4A5568]">Agreement</div>
                            <div className="text-sm font-bold text-[#2C3E38] flex items-center gap-1">Download PDF <Download className="w-3 h-3 text-[#C7A36A]" /></div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {req.monthlyRentPayouts && req.monthlyRentPayouts.length > 0 && (
                    <div className="lg:w-1/3 shrink-0 rounded-xl bg-white border border-[#E8DFD6] shadow-sm p-4 hover:bg-[#FAF6EF] transition-colors">
                      <h4 className="text-sm font-bold text-[#2C3E38] mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#C7A36A]" /> Recent Payouts
                      </h4>
                      <div className="space-y-3">
                        {req.monthlyRentPayouts.map((payout, idx) => (
                          <div key={idx} className="flex justify-between items-center pb-2 border-b border-[#E8DFD6] last:border-0 last:pb-0">
                            <div>
                              <div className="text-sm font-bold text-[#2C3E38]">{payout.month}</div>
                              <div className="text-xs font-medium text-[#4A5568]">{new Date(payout.payoutDate).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#2C3E38]"><span className="text-[#C7A36A]">₹</span>{payout.amount.toLocaleString()}</div>
                              <div className={`text-xs font-bold ${payout.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{payout.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {req.status === 'Renewal Due' && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 border-l-4 border-amber-400 flex justify-between items-center">
                     <div className="text-amber-800 text-sm font-bold">This lease is approaching expiration. Contact your RM to discuss renewal.</div>
                     <button className="px-4 py-2 bg-white rounded-full border border-amber-200 text-amber-700 text-sm font-bold hover:bg-amber-100 transition-colors shadow-sm">Contact RM</button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Modal isOpen={newLeaseModal} onClose={() => setNewLeaseModal(false)} title="Submit Property for Lease">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Select Property</label>
            <select 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]"
              value={formData.propertyId}
              onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
            >
              <option value="">Select a property...</option>
              {myProperties.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#2C3E38] mb-2">Duration (Months)</label>
              <input type="number" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2C3E38] mb-2">Expected Rent (₹)</label>
              <input type="number" className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" value={formData.expectedRent} onChange={e => setFormData({ ...formData, expectedRent: e.target.value })} placeholder="e.g. 35000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Occupancy Type</label>
            <select 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]"
              value={formData.occupancyType}
              onChange={e => setFormData({ ...formData, occupancyType: e.target.value })}
            >
              <option value="Long Term Rental">Long Term Rental</option>
              <option value="Serviced Apartment">Serviced Apartment</option>
              <option value="Airbnb / Short Term">Airbnb / Short Term</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Special Conditions / Notes</label>
            <textarea 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-24"
              value={formData.conditions}
              onChange={e => setFormData({ ...formData, conditions: e.target.value })}
              placeholder="e.g. Vegetarian family preferred..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setNewLeaseModal(false)} className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]">Cancel</button>
            <button onClick={handleSubmit} disabled={!formData.propertyId || !formData.expectedRent} className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold disabled:opacity-50">Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

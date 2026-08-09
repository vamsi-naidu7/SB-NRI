"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, FileText, ChevronDown, ChevronUp, CheckCircle, Flag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

const PIPELINE_STEPS = ['Requested', 'Agreement Pending', 'Active', 'Renewal Due', 'Renewed', 'Closed'];

export default function LeaseWorkflow() {
  const { leaseRequests, updateLeaseRequest, addNotification, addActivityLog } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Agreement Modal State
  const [agreementUrl, setAgreementUrl] = useState('');
  const [occupancyType, setOccupancyType] = useState('Family');

  // Payout Modal State
  const [payoutMonth, setPayoutMonth] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutDate, setPayoutDate] = useState('');

  const filteredRequests = leaseRequests.filter(r => activeTab === 'All' ? true : r.status === activeTab);

  const handleStatusChange = (reqId: string, newStatus: string) => {
    updateLeaseRequest(reqId, { status: newStatus as any });
    addActivityLog({ id: `log-${Date.now()}`, action: 'STATUS_UPDATE', description: `Lease status updated to ${newStatus}`, user: 'RM Name', role: 'rm' as any, timestamp: new Date().toISOString() });
  };

  const openAgreementModal = (id: string) => {
    setSelectedReqId(id);
    setAgreementUrl('');
    setOccupancyType('Family');
    setAgreementModalOpen(true);
  };

  const submitAgreement = () => {
    if (!selectedReqId) return;
    updateLeaseRequest(selectedReqId, {
      status: 'Active',
      agreementCopyPdf: agreementUrl,
      occupancyType: occupancyType as any
    });
    addNotification({ id: `notif-${Date.now()}`, title: 'Agreement Uploaded', message: `Lease agreement activated.`, type: 'success', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
    setAgreementModalOpen(false);
  };

  const openPayoutModal = (id: string) => {
    setSelectedReqId(id);
    setPayoutMonth(''); setPayoutAmount(''); setPayoutDate(new Date().toISOString().split('T')[0]);
    setPayoutModalOpen(true);
  };

  const submitPayout = () => {
    if (!selectedReqId) return;
    const req = leaseRequests.find(r => r.id === selectedReqId);
    const newPayout = { id: `payout-${Date.now()}`, month: payoutMonth, amount: Number(payoutAmount), status: 'Paid' as any, payoutDate };
    
    updateLeaseRequest(selectedReqId, {
      monthlyRentPayouts: [...(req?.monthlyRentPayouts || []), newPayout]
    });
    
    addNotification({ id: `notif-${Date.now()}`, title: 'Payout Recorded', message: `Rent payout for ${payoutMonth} recorded.`, type: 'success', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
    setPayoutModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] mb-4 sm:mb-6">Lease Pipeline</h2>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {['All', ...PIPELINE_STEPS].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-[#C7A36A] text-white shadow-2xs' 
                  : 'bg-white text-[#4A5568] hover:text-[#2C3E38] border border-[#E8DFD6]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map(req => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-xl overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-[#2C3E38]">{req.propertyTitle}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-[#4A5568]">{req.nriName}</p>
                  <div className="flex gap-4 mt-2 text-sm text-[#4A5568] bg-[#FAF6EF] p-2 rounded-lg inline-flex border border-[#E8DFD6]/50">
                    <span><strong className="text-[#2C3E38] font-medium">Duration:</strong> {req.leaseDurationMonths} months</span>
                    <span><strong className="text-[#2C3E38] font-medium">Expected Rent:</strong> ₹{req.expectedMonthlyRent}</span>
                    <span><strong className="text-[#2C3E38] font-medium">Occupancy:</strong> {req.occupancyType}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {req.status === 'Requested' && (
                    <button onClick={() => handleStatusChange(req.id, 'Agreement Pending')} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors">
                      Start Process
                    </button>
                  )}
                  {req.status === 'Agreement Pending' && (
                    <button onClick={() => openAgreementModal(req.id)} className="px-6 py-2 bg-[#C7A36A] hover:bg-[#C7A36A]/90 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Upload Agreement
                    </button>
                  )}
                  {req.status === 'Active' && (
                    <>
                      <button onClick={() => openPayoutModal(req.id)} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors">
                        Record Payout
                      </button>
                      <button onClick={() => handleStatusChange(req.id, 'Renewal Due')} className="px-6 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                        <Flag className="w-4 h-4" /> Flag Renewal
                      </button>
                    </>
                  )}
                  {req.status === 'Renewal Due' && (
                    <button onClick={() => handleStatusChange(req.id, 'Renewed')} className="px-6 py-2 bg-[#C7A36A] hover:bg-[#C7A36A]/90 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Renew Lease
                    </button>
                  )}
                  
                  {req.monthlyRentPayouts?.length > 0 && (
                    <button onClick={() => setExpandedId(expandedId === req.id ? null : req.id)} className="p-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors">
                      {expandedId === req.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {expandedId === req.id && req.monthlyRentPayouts && (
                <div className="border-t border-[#E8DFD6]/50 bg-[#FAF6EF] p-5">
                  <h4 className="text-sm font-medium text-[#2C3E38] mb-3">Rent Payout History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[#4A5568]">
                      <thead className="text-xs text-[#2C3E38] uppercase bg-white border border-[#E8DFD6] rounded-lg">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Month</th>
                          <th className="px-4 py-3">Amount (₹)</th>
                          <th className="px-4 py-3 rounded-r-lg">Date Paid</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border-x border-b border-[#E8DFD6] rounded-b-lg shadow-sm">
                        {req.monthlyRentPayouts.map((payout: any, i: number) => (
                          <tr key={i} className="border-b border-[#E8DFD6] last:border-0">
                            <td className="px-4 py-3 font-medium text-[#2C3E38]">{payout.month}</td>
                            <td className="px-4 py-3 text-[#C7A36A] font-medium">₹{payout.amount}</td>
                            <td className="px-4 py-3 text-[#4A5568]">{new Date(payout.payoutDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <p className="text-[#4A5568] text-center py-8">No lease requests found.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Agreement Modal */}
      <Modal isOpen={agreementModalOpen} onClose={() => setAgreementModalOpen(false)} title="Upload Lease Agreement">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Agreement PDF URL</label>
            <input type="url" value={agreementUrl} onChange={e => setAgreementUrl(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Final Occupancy Type</label>
            <select value={occupancyType} onChange={e => setOccupancyType(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]">
              <option value="Family">Family</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Company Guest House">Company Guest House</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setAgreementModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
            <button onClick={submitAgreement} disabled={!agreementUrl} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 disabled:opacity-50 text-white rounded-full font-medium transition-colors">Activate Lease</button>
          </div>
        </div>
      </Modal>

      {/* Payout Modal */}
      <Modal isOpen={payoutModalOpen} onClose={() => setPayoutModalOpen(false)} title="Record Rent Payout">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Payout Month</label>
            <input type="text" value={payoutMonth} onChange={e => setPayoutMonth(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="e.g., August 2024" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Amount Paid (₹)</label>
            <input type="number" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="50000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Payout Date</label>
            <input type="date" value={payoutDate} onChange={e => setPayoutDate(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setPayoutModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
            <button onClick={submitPayout} disabled={!payoutMonth || !payoutAmount} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 disabled:opacity-50 text-white rounded-full font-medium transition-colors">Record Payout</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { Wrench, ChevronDown, ChevronUp, Image as ImageIcon, AlertTriangle, FileText } from 'lucide-react';

export default function MaintenanceHub() {
  const { maintenanceRequests, properties, addMaintenanceRequest } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [newReqModal, setNewReqModal] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleNewRequest = () => {
    if (selectedPropId && requirements) {
      const property = properties.find(p => p.id === selectedPropId);
      if (property) {
        addMaintenanceRequest({ 
          id: `mr-${Date.now()}`,
          propertyId: selectedPropId, 
          propertyTitle: property.title,
          propertyAddress: property.address,
          propertyImage: property.images[0] || '',
          nriId: 'nri-1',
          nriName: 'Rajesh Sharma',
          assignedRmId: 'rm-1',
          assignedRmName: 'Priya Verma',
          status: 'Requested', 
          requirements,
          monthlyInspections: [],
          emergencyInspections: [],
          createdAt: new Date().toISOString()
        });
      }
      setNewReqModal(false);
      setRequirements('');
      setSelectedPropId('');
    }
  };

  const myProperties = properties; // Display all properties

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Maintenance Hub</h1>
          <p className="text-xs sm:text-sm text-[#4A5568]">Track regular inspections and emergency repairs for your properties.</p>
        </div>
        <button 
          onClick={() => setNewReqModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shadow-md shrink-0"
        >
          <Wrench className="w-4 h-4 text-[#C7A36A]" />
          Request Maintenance
        </button>
      </div>

      <motion.div className="space-y-4" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        <AnimatePresence>
          {maintenanceRequests.map(req => {
            const prop = properties.find(p => p.id === req.propertyId);
            const isExpanded = expandedId === req.id;

            return (
              <motion.div key={req.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-[#FAF6EF]/50 transition-colors flex flex-col md:flex-row justify-between gap-4" onClick={() => setExpandedId(isExpanded ? null : req.id)}>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#FAF6EF] overflow-hidden shrink-0 hidden sm:block border border-[#E8DFD6]">
                      {prop?.images?.[0] ? <img src={prop.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#E8DFD6]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <StatusBadge status={req.status} />
                        <span className="text-xs font-bold text-[#4A5568]">RM: {req.assignedRmId}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#2C3E38]">{prop?.title || 'Unknown Property'}</h3>
                      <p className="text-sm text-[#4A5568] line-clamp-1 mt-1">{req.requirements}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end shrink-0">
                    <button className="p-2 rounded-full hover:bg-[#FAF6EF] text-[#C7A36A] transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[#E8DFD6] bg-[#FAF6EF]/30">
                      <div className="p-6 space-y-8">
                        {req.monthlyInspections && req.monthlyInspections.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-[#2C3E38] uppercase tracking-wider mb-4">Monthly Inspections</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {req.monthlyInspections.map((insp, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white shadow-sm border border-[#E8DFD6] space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-[#2C3E38]">{insp.month}</span>
                                    <span className="text-xs font-medium text-[#4A5568]">{new Date(insp.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-[#4A5568]">{insp.comments}</p>
                                  {insp.photos && insp.photos.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {insp.photos.map((p, i) => (
                                        <div key={i} className="w-12 h-12 rounded-lg bg-[#FAF6EF] border border-[#E8DFD6] flex items-center justify-center text-[#C7A36A] overflow-hidden">
                                          <ImageIcon className="w-4 h-4" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <button className="text-xs font-bold text-[#2C3E38] hover:text-[#C7A36A] flex items-center gap-1 mt-2 transition-colors">
                                    <FileText className="w-3 h-3" /> Download Report
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {req.emergencyInspections && req.emergencyInspections.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-[#2C3E38] uppercase tracking-wider mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" /> Emergency & Repairs
                            </h4>
                            <div className="space-y-3">
                              {req.emergencyInspections.map((issue, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-red-50 border-l-4 border-red-400 flex flex-col md:flex-row justify-between gap-4 shadow-sm">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h5 className="font-bold text-red-900">{issue.issueTitle}</h5>
                                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {issue.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-red-800/80 mb-2">{issue.repairRecommendation}</p>
                                    <div className="text-sm font-bold text-red-900">
                                      Est. Cost: <span className="text-red-700">₹{issue.estimatedCost.toLocaleString()}</span>
                                    </div>
                                  </div>
                                  {issue.status !== 'Resolved' && (
                                    <div className="flex items-center">
                                      <button className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors shadow-md">
                                        Approve Repair
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Modal isOpen={newReqModal} onClose={() => setNewReqModal(false)} title="New Maintenance Request">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Select Property</label>
            <select 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]"
              value={selectedPropId}
              onChange={e => setSelectedPropId(e.target.value)}
            >
              <option value="">Select a property...</option>
              {myProperties.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2C3E38] mb-2">Requirements</label>
            <textarea 
              className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-32"
              placeholder="E.g. Regular monthly inspection required, fix the leaky faucet..."
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setNewReqModal(false)} className="px-6 py-2.5 rounded-full border border-[#C7A36A] text-[#2C3E38] font-semibold hover:bg-[#FAF6EF]">Cancel</button>
            <button onClick={handleNewRequest} disabled={!selectedPropId || !requirements} className="px-6 py-2.5 rounded-full bg-[#2C3E38] text-white font-semibold disabled:opacity-50">Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, FileText, Upload, Plus, X, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

const PIPELINE_STEPS = ['Submitted', 'Assigned', 'Verification In Progress', 'Report Uploaded', 'Completed'];

export default function VerificationWorkflow() {
  const { verificationRequests, updateVerificationRequest, addNotification, addActivityLog } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // Modal State
  const [reportUrl, setReportUrl] = useState('');
  const [sitePhotos, setSitePhotos] = useState<string[]>(['']);
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const filteredRequests = verificationRequests.filter(r => activeTab === 'All' ? true : r.status === activeTab);

  const handleStatusChange = (reqId: string, newStatus: string) => {
    updateVerificationRequest(reqId, { status: newStatus as any });
    addActivityLog({ id: `log-${Date.now()}`, action: 'STATUS_UPDATE', description: `Verification status updated to ${newStatus}`, user: 'RM Name', role: 'rm' as any, timestamp: new Date().toISOString() });
    addNotification({ id: `notif-${Date.now()}`, title: 'Status Updated', message: `Verification moved to ${newStatus}`, type: 'success', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
  };

  const openReportModal = (reqId: string) => {
    setSelectedReqId(reqId);
    setReportUrl('');
    setSitePhotos(['']);
    setComments('');
    setRecommendation(null);
    setReportModalOpen(true);
  };

  const submitReport = () => {
    if (!selectedReqId || !recommendation) return;
    updateVerificationRequest(selectedReqId, {
      status: 'Report Uploaded',
      verificationReportPdf: reportUrl,
      rmImages: sitePhotos.filter(p => p),
      rmComments: comments,
      recommendation: recommendation as any
    });
    addActivityLog({ id: `log-${Date.now()}`, action: 'REPORT_UPLOADED', description: `Verification report uploaded`, user: 'RM Name', role: 'rm' as any, timestamp: new Date().toISOString() });
    addNotification({ id: `notif-${Date.now()}`, title: 'Report Uploaded', message: `Report successfully uploaded for verification`, type: 'success', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
    setReportModalOpen(false);
  };

  const getStepIndex = (status: string) => PIPELINE_STEPS.indexOf(status);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] mb-4 sm:mb-6">Verification Pipeline</h2>
        <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div className="flex items-center justify-between relative min-w-[500px] px-2">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-[#E8DFD6] rounded-full" />
            {PIPELINE_STEPS.map((step) => {
               const isActive = activeTab === step;
               const dotClass = isActive ? 'bg-[#C7A36A] border-[#C7A36A] ring-4 ring-[#C7A36A]/20' : 'bg-white border-[#E8DFD6]';
               return (
                 <div key={step} className="relative z-10 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveTab(step)}>
                   <div className={`w-4 h-4 rounded-full border-2 ${dotClass} transition-all`} />
                   <span className={`text-xs font-semibold max-w-[90px] text-center ${isActive ? 'text-[#2C3E38]' : 'text-[#4A5568]'}`}>{step}</span>
                 </div>
               );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...PIPELINE_STEPS].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-[#C7A36A] text-white' 
                : 'bg-white text-[#4A5568] hover:text-[#2C3E38] border border-[#E8DFD6]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map(req => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-[#2C3E38]">{req.propertyTitle}</h3>
                  {req.isExternal && (
                    <span className="px-2 py-1 bg-[#C7A36A]/10 text-[#C7A36A] text-xs rounded-md border border-[#C7A36A]/20">External Property</span>
                  )}
                </div>
                <p className="text-[#4A5568] text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {req.propertyAddress}
                </p>
                <div className="text-sm text-[#4A5568]">
                  <span className="font-medium text-[#2C3E38]">{req.nriName}</span> • {req.nriEmail}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <StatusBadge status={req.status} />
                
                {req.status === 'Submitted' && (
                  <button onClick={() => handleStatusChange(req.id, 'Assigned')} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors w-full md:w-auto">
                    Accept Assignment
                  </button>
                )}
                {req.status === 'Assigned' && (
                  <button onClick={() => handleStatusChange(req.id, 'Verification In Progress')} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors w-full md:w-auto">
                    Start Verification
                  </button>
                )}
                {req.status === 'Verification In Progress' && (
                  <button onClick={() => openReportModal(req.id)} className="px-6 py-2 bg-[#C7A36A] hover:bg-[#C7A36A]/90 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 justify-center w-full md:w-auto">
                    <Upload className="w-4 h-4" /> Upload Report
                  </button>
                )}
                {req.status === 'Report Uploaded' && (
                  <button onClick={() => handleStatusChange(req.id, 'Completed')} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors w-full md:w-auto">
                    Mark Complete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <p className="text-[#4A5568] text-center py-8">No verification requests found.</p>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Upload Verification Report">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Report PDF URL</label>
            <input type="url" value={reportUrl} onChange={e => setReportUrl(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Site Photos URLs</label>
            {sitePhotos.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={url} onChange={e => {
                  const newPhotos = [...sitePhotos];
                  newPhotos[i] = e.target.value;
                  setSitePhotos(newPhotos);
                }} className="flex-1 bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
                {sitePhotos.length > 1 && (
                  <button onClick={() => setSitePhotos(sitePhotos.filter((_, idx) => idx !== i))} className="p-2 text-[#4A5568] hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setSitePhotos([...sitePhotos, ''])} className="text-sm text-[#C7A36A] hover:text-[#C7A36A]/80 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Detailed Comments</label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-24 resize-none" placeholder="Enter findings..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-2">Recommendation</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button onClick={() => setRecommendation('Recommended')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${recommendation === 'Recommended' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-[#E8DFD6] text-[#4A5568] hover:border-[#C7A36A]'}`}>
                <CheckCircle className="w-6 h-6" />
                <span className="text-xs font-medium text-center">Recommended</span>
              </button>
              <button onClick={() => setRecommendation('Recommended with Conditions')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${recommendation === 'Recommended with Conditions' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-[#E8DFD6] text-[#4A5568] hover:border-[#C7A36A]'}`}>
                <AlertTriangle className="w-6 h-6" />
                <span className="text-xs font-medium text-center">With Conditions</span>
              </button>
              <button onClick={() => setRecommendation('Not Recommended')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${recommendation === 'Not Recommended' ? 'bg-red-50 border-red-400 text-red-700' : 'bg-white border-[#E8DFD6] text-[#4A5568] hover:border-[#C7A36A]'}`}>
                <XCircle className="w-6 h-6" />
                <span className="text-xs font-medium text-center">Not Recommended</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setReportModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
            <button onClick={submitReport} disabled={!recommendation} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors">
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

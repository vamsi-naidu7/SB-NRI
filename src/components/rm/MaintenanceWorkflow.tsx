"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, X, Upload, AlertTriangle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

const PIPELINE_STEPS = ['Requested', 'Active', 'Monthly Inspection Completed', 'Issue Reported', 'Completed'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MaintenanceWorkflow() {
  const { maintenanceRequests, updateMaintenanceRequest, addNotification, addActivityLog } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  
  // Modals
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Inspection Form State
  const [inspectionMonth, setInspectionMonth] = useState(MONTHS[new Date().getMonth()]);
  const [photos, setPhotos] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>(['']);
  const [reportUrl, setReportUrl] = useState('');
  const [comments, setComments] = useState('');

  // Emergency Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [repairRec, setRepairRec] = useState('');
  const [estCost, setEstCost] = useState('');

  const filteredRequests = maintenanceRequests.filter(r => activeTab === 'All' ? true : r.status === activeTab);

  const handleStatusChange = (reqId: string, newStatus: string) => {
    updateMaintenanceRequest(reqId, { status: newStatus as any });
    addActivityLog({ id: `log-${Date.now()}`, action: 'STATUS_UPDATE', description: `Maintenance status updated to ${newStatus}`, user: 'RM Name', role: 'rm' as any, timestamp: new Date().toISOString() });
  };

  const submitInspection = () => {
    if (!selectedReqId) return;
    const req = maintenanceRequests.find(r => r.id === selectedReqId);
    const newInspection = { id: `insp-${Date.now()}`, month: inspectionMonth, photos: photos.filter(p=>p), videos: videos.filter(v=>v), reportPdf: reportUrl, comments, date: new Date().toISOString() };
    
    updateMaintenanceRequest(selectedReqId, {
      status: 'Monthly Inspection Completed',
      monthlyInspections: [...(req?.monthlyInspections || []), newInspection]
    });
    
    addNotification({ id: `notif-${Date.now()}`, title: 'Inspection Logged', message: `Monthly inspection for ${inspectionMonth} added.`, type: 'success', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
    setInspectionModalOpen(false);
  };

  const submitEmergency = () => {
    if (!selectedReqId) return;
    const req = maintenanceRequests.find(r => r.id === selectedReqId);
    const newIssue = { id: `emerg-${Date.now()}`, issueTitle, issueDetails, photos: photos.filter(p=>p), repairRecommendation: repairRec, estimatedCost: Number(estCost), date: new Date().toISOString(), status: 'Reported' as any };

    updateMaintenanceRequest(selectedReqId, {
      status: 'Issue Reported',
      emergencyInspections: [...(req?.emergencyInspections || []), newIssue]
    });

    addNotification({ id: `notif-${Date.now()}`, title: 'Issue Reported', message: `Emergency issue reported to NRI.`, type: 'warning', role: 'nri' as any, read: false, createdAt: new Date().toISOString() });
    setEmergencyModalOpen(false);
  };

  const openInspectionModal = (id: string) => {
    setSelectedReqId(id);
    setPhotos(['']); setVideos(['']); setReportUrl(''); setComments('');
    setInspectionModalOpen(true);
  };

  const openEmergencyModal = (id: string) => {
    setSelectedReqId(id);
    setPhotos(['']); setIssueTitle(''); setIssueDetails(''); setRepairRec(''); setEstCost('');
    setEmergencyModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] mb-4 sm:mb-6">Maintenance Pipeline</h2>
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
                  <p className="text-sm text-[#4A5568]">{req.nriName} • {req.requirements}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {req.status === 'Requested' && (
                    <button onClick={() => handleStatusChange(req.id, 'Active')} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full text-sm font-medium transition-colors">
                      Accept Request
                    </button>
                  )}
                  {(req.status === 'Active' || req.status === 'Monthly Inspection Completed') && (
                    <>
                      <button onClick={() => openInspectionModal(req.id)} className="px-6 py-2 bg-[#C7A36A]/10 text-[#C7A36A] hover:bg-[#C7A36A]/20 border border-[#C7A36A]/20 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Monthly Log
                      </button>
                      <button onClick={() => openEmergencyModal(req.id)} className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Report Issue
                      </button>
                    </>
                  )}
                  {req.status !== 'Completed' && (
                    <button onClick={() => handleStatusChange(req.id, 'Completed')} className="px-6 py-2 bg-[#E8DFD6] hover:bg-[#D6CBBF] text-[#2C3E38] rounded-full text-sm font-medium transition-colors">
                      Mark Complete
                    </button>
                  )}
                  
                  {(req.monthlyInspections?.length > 0 || req.emergencyInspections?.length > 0) && (
                    <button onClick={() => setExpandedId(expandedId === req.id ? null : req.id)} className="p-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors">
                      {expandedId === req.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Content */}
              {expandedId === req.id && (
                <div className="border-t border-[#E8DFD6]/50 bg-[#FAF6EF] p-5 space-y-6">
                  {req.monthlyInspections && req.monthlyInspections.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[#2C3E38] mb-3">Past Monthly Inspections</h4>
                      <div className="grid gap-3">
                        {req.monthlyInspections.map((insp: any, i: number) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-[#E8DFD6]/50 flex justify-between items-center shadow-sm">
                            <div>
                              <p className="text-[#C7A36A] font-medium text-sm">{insp.month} Inspection</p>
                              <p className="text-xs text-[#4A5568] mt-1 truncate max-w-md">{insp.comments}</p>
                            </div>
                            <span className="text-xs text-[#4A5568]">{new Date(insp.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {req.emergencyInspections && req.emergencyInspections.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[#2C3E38] mb-3">Reported Issues</h4>
                      <div className="grid gap-3">
                        {req.emergencyInspections.map((issue: any, i: number) => (
                          <div key={i} className="bg-red-50 p-3 rounded-xl border border-red-200">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-red-700 font-medium text-sm">{issue.issueTitle}</p>
                              <span className="text-xs text-red-500">{new Date(issue.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-red-600 mb-2">{issue.issueDetails}</p>
                            <p className="text-xs text-red-700"><span className="text-red-500">Est. Cost:</span> ₹{issue.estimatedCost}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <p className="text-[#4A5568] text-center py-8">No maintenance requests found.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Monthly Inspection Modal */}
      <Modal isOpen={inspectionModalOpen} onClose={() => setInspectionModalOpen(false)} title="Log Monthly Inspection">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Month</label>
            <select value={inspectionMonth} onChange={e => setInspectionMonth(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]">
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Photos URLs</label>
            {photos.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={url} onChange={e => { const newArr = [...photos]; newArr[i] = e.target.value; setPhotos(newArr); }} className="flex-1 bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
                {photos.length > 1 && <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="p-2 text-[#4A5568] hover:text-red-500"><X className="w-5 h-5" /></button>}
              </div>
            ))}
            <button onClick={() => setPhotos([...photos, ''])} className="text-sm text-[#C7A36A] hover:text-[#C7A36A]/80 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Photo</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Videos URLs</label>
            {videos.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={url} onChange={e => { const newArr = [...videos]; newArr[i] = e.target.value; setVideos(newArr); }} className="flex-1 bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
                {videos.length > 1 && <button onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="p-2 text-[#4A5568] hover:text-red-500"><X className="w-5 h-5" /></button>}
              </div>
            ))}
            <button onClick={() => setVideos([...videos, ''])} className="text-sm text-[#C7A36A] hover:text-[#C7A36A]/80 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Video</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Report PDF URL (Optional)</label>
            <input type="url" value={reportUrl} onChange={e => setReportUrl(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Comments</label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-24 resize-none" placeholder="Inspection notes..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setInspectionModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
            <button onClick={submitInspection} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white rounded-full font-medium transition-colors">Log Inspection</button>
          </div>
        </div>
      </Modal>

      {/* Emergency Modal */}
      <Modal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} title="Report Emergency/Issue">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Issue Title</label>
            <input type="text" value={issueTitle} onChange={e => setIssueTitle(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="e.g., Water Leakage in Kitchen" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Detailed Description</label>
            <textarea value={issueDetails} onChange={e => setIssueDetails(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-20 resize-none" placeholder="Describe the issue..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Issue Photos URLs</label>
            {photos.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={url} onChange={e => { const newArr = [...photos]; newArr[i] = e.target.value; setPhotos(newArr); }} className="flex-1 bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="https://..." />
                {photos.length > 1 && <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="p-2 text-[#4A5568] hover:text-red-500"><X className="w-5 h-5" /></button>}
              </div>
            ))}
            <button onClick={() => setPhotos([...photos, ''])} className="text-sm text-[#C7A36A] hover:text-[#C7A36A]/80 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Photo</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Repair Recommendation</label>
            <textarea value={repairRec} onChange={e => setRepairRec(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] h-20 resize-none" placeholder="Proposed fix..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E38] mb-1">Estimated Cost (₹)</label>
            <input type="number" value={estCost} onChange={e => setEstCost(e.target.value)} className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A]" placeholder="0" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setEmergencyModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
            <button onClick={submitEmergency} disabled={!issueTitle || !estCost} className="px-6 py-2 bg-[#2C3E38] hover:bg-[#2C3E38]/90 disabled:opacity-50 text-white rounded-full font-medium transition-colors">Submit Report</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

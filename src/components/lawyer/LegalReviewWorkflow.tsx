"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, CheckCircle, AlertTriangle, Clock, Eye, MapPin, MessageSquare, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { VerificationCheckpoint } from '@/types';

const PIPELINE_STEPS = ['Pending', 'In Review', 'Completed'];

const statusIcon = (status: VerificationCheckpoint['status']) => {
  switch (status) {
    case 'approved': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    case 'flagged': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    case 'in-review': return <Eye className="w-4 h-4 text-blue-600" />;
    default: return <Clock className="w-4 h-4 text-[#4A5568]" />;
  }
};

const statusColor = (status: VerificationCheckpoint['status']) => {
  switch (status) {
    case 'approved': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'flagged': return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'in-review': return 'bg-blue-50 border-blue-200 text-blue-700';
    default: return 'bg-gray-50 border-gray-200 text-gray-600';
  }
};

export default function LegalReviewWorkflow() {
  const { verificationRequests, updateVerificationRequest, addNotification, addActivityLog } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'flagged' | null>(null);

  // Filter only requests with legal checkpoints
  const relevantRequests = verificationRequests.filter(vr =>
    vr.checkpoints?.some(cp => cp.assignedTo === 'lawyer' && cp.selected)
  );

  const filteredRequests = relevantRequests.filter(req => {
    if (activeTab === 'All') return true;
    const lawyerCps = req.checkpoints?.filter(cp => cp.assignedTo === 'lawyer' && cp.selected) || [];
    if (activeTab === 'Pending') return lawyerCps.some(cp => cp.status === 'pending');
    if (activeTab === 'In Review') return lawyerCps.some(cp => cp.status === 'in-review');
    if (activeTab === 'Completed') return lawyerCps.every(cp => cp.status === 'approved' || cp.status === 'flagged');
    return true;
  });

  const openReviewModal = (reqId: string, cpId: string) => {
    setSelectedReqId(reqId);
    setSelectedCheckpointId(cpId);
    setReviewComments('');
    setReviewDecision(null);
    setReviewModalOpen(true);
  };

  const submitReview = () => {
    if (!selectedReqId || !selectedCheckpointId || !reviewDecision) return;
    const req = verificationRequests.find(r => r.id === selectedReqId);
    if (!req || !req.checkpoints) return;

    const updatedCheckpoints = req.checkpoints.map(cp =>
      cp.id === selectedCheckpointId
        ? { ...cp, status: reviewDecision, reviewerName: 'Adv. Meenakshi Iyer', reviewComments, reviewDate: new Date().toISOString() }
        : cp
    );

    updateVerificationRequest(selectedReqId, { checkpoints: updatedCheckpoints as VerificationCheckpoint[], dateUpdated: new Date().toISOString() });

    const cp = req.checkpoints.find(c => c.id === selectedCheckpointId);
    addActivityLog({
      id: `log-${Date.now()}`,
      action: reviewDecision === 'approved' ? 'CHECKPOINT_APPROVED' : 'CHECKPOINT_FLAGGED',
      description: `Legal checkpoint "${cp?.name}" ${reviewDecision} for ${req.propertyTitle}`,
      user: 'Adv. Meenakshi Iyer',
      role: 'lawyer',
      timestamp: new Date().toISOString(),
    });

    addNotification({
      id: `notif-${Date.now()}`,
      title: reviewDecision === 'approved' ? 'Legal Checkpoint Approved' : 'Legal Checkpoint Flagged',
      message: `"${cp?.name}" for ${req.propertyTitle} has been ${reviewDecision} by the lawyer.`,
      type: reviewDecision === 'approved' ? 'success' : 'warning',
      role: 'rm',
      read: false,
      createdAt: new Date().toISOString(),
    });

    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Legal Review Workflow</h1>
        <p className="text-xs sm:text-sm text-[#4A5568]">Review and verify legal checkpoints for property verification requests.</p>
      </div>

      {/* Pipeline */}
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] mb-4 sm:mb-6">Review Pipeline</h2>
        <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div className="flex items-center justify-between relative min-w-[400px] px-2">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-[#E8DFD6] rounded-full" />
            {PIPELINE_STEPS.map((step) => {
              const isActive = activeTab === step;
              const dotClass = isActive ? 'bg-[#6366f1] border-[#6366f1] ring-4 ring-[#6366f1]/20' : 'bg-white border-[#E8DFD6]';
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...PIPELINE_STEPS].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#6366f1] text-white'
                : 'bg-white text-[#4A5568] hover:text-[#2C3E38] border border-[#E8DFD6]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map(req => {
            const lawyerCps = req.checkpoints?.filter(cp => cp.assignedTo === 'lawyer' && cp.selected) || [];
            const completedCount = lawyerCps.filter(cp => cp.status === 'approved' || cp.status === 'flagged').length;
            const progressPct = lawyerCps.length > 0 ? Math.round((completedCount / lawyerCps.length) * 100) : 0;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-[#2C3E38]">{req.propertyTitle}</h3>
                      {req.isExternal && (
                        <span className="px-2 py-1 bg-[#6366f1]/10 text-[#6366f1] text-xs rounded-md border border-[#6366f1]/20">External</span>
                      )}
                    </div>
                    <p className="text-[#4A5568] text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {req.propertyAddress}
                    </p>
                    <div className="text-sm text-[#4A5568]">
                      <span className="font-medium text-[#2C3E38]">{req.nriName}</span> • {req.nriEmail}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#4A5568]">{completedCount}/{lawyerCps.length} done</div>
                      <div className="w-20 h-1.5 bg-[#E8DFD6] rounded-full mt-1">
                        <div className="h-full bg-[#6366f1] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoints */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#2C3E38] flex items-center gap-2 mb-3">
                    <Scale className="w-4 h-4 text-[#6366f1]" />
                    Legal Checkpoints
                  </h4>
                  <div className="grid gap-2">
                    {lawyerCps.map(cp => (
                      <div key={cp.id} className={`flex items-center justify-between p-3 rounded-xl border ${statusColor(cp.status)} transition-all`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {statusIcon(cp.status)}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{cp.name}</p>
                            <p className="text-xs opacity-70 truncate">{cp.description}</p>
                            {cp.reviewComments && (
                              <p className="text-xs mt-1 flex items-start gap-1">
                                <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{cp.reviewComments}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 ml-3">
                          {(cp.status === 'pending' || cp.status === 'in-review') ? (
                            <button
                              onClick={() => openReviewModal(req.id, cp.id)}
                              className="px-4 py-1.5 bg-[#6366f1] hover:bg-[#6366f1]/90 text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              Review
                            </button>
                          ) : (
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/60">
                              {cp.status === 'approved' ? '✓ Approved' : '⚠ Flagged'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFD6]/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
              <Scale className="w-12 h-12 text-[#6366f1] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#2C3E38] mb-1">No reviews found</h3>
              <p className="text-[#4A5568]">No legal review assignments in this category.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Submit Legal Review">
        <div className="space-y-4">
          {selectedReqId && selectedCheckpointId && (() => {
            const req = verificationRequests.find(r => r.id === selectedReqId);
            const cp = req?.checkpoints?.find(c => c.id === selectedCheckpointId);
            return (
              <>
                <div className="p-4 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/20">
                  <p className="text-sm font-bold text-[#2C3E38]">{cp?.name}</p>
                  <p className="text-xs text-[#4A5568] mt-1">{cp?.description}</p>
                  <p className="text-xs text-[#4A5568] mt-2">Property: <span className="font-medium text-[#2C3E38]">{req?.propertyTitle}</span></p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C3E38] mb-1">Legal Opinion / Comments</label>
                  <textarea
                    value={reviewComments}
                    onChange={e => setReviewComments(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#6366f1] h-28 resize-none"
                    placeholder="Enter your legal findings and opinion..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C3E38] mb-2">Decision</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setReviewDecision('approved')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                        reviewDecision === 'approved'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                          : 'bg-white border-[#E8DFD6] text-[#4A5568] hover:border-[#6366f1]'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-sm font-medium">Approved</span>
                      <span className="text-xs opacity-70">Document is authentic</span>
                    </button>
                    <button
                      onClick={() => setReviewDecision('flagged')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                        reviewDecision === 'flagged'
                          ? 'bg-amber-50 border-amber-400 text-amber-700'
                          : 'bg-white border-[#E8DFD6] text-[#4A5568] hover:border-[#6366f1]'
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                      <span className="text-sm font-medium">Flagged</span>
                      <span className="text-xs opacity-70">Concerns identified</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setReviewModalOpen(false)} className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium">Cancel</button>
                  <button
                    onClick={submitReview}
                    disabled={!reviewDecision}
                    className="px-6 py-2 bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
}

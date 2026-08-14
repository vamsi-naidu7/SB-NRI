"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Clock, CheckCircle, MapPin, User, Calendar, Send, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/ui/Modal';

type TabFilter = 'All' | 'Pending' | 'Uploaded';

export default function DocumentRequests() {
  const { documentRequests, updateDocumentRequest, addNotification, addActivityLog } = useApp();
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [agentNotes, setAgentNotes] = useState('');

  const agentId = 'agent-1';
  const myRequests = documentRequests.filter(dr => dr.targetAgentId === agentId);

  const filteredRequests = myRequests.filter(req => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
  const uploadedCount = myRequests.filter(r => r.status === 'Uploaded').length;

  const openUploadModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setUploadFileName('');
    setUploadFileUrl('');
    setAgentNotes('');
    setUploadModalOpen(true);
  };

  const handleUpload = () => {
    if (!selectedRequestId || !uploadFileName) return;

    const request = documentRequests.find(r => r.id === selectedRequestId);
    if (!request) return;

    updateDocumentRequest(selectedRequestId, {
      status: 'Uploaded',
      uploadedFileUrl: uploadFileUrl || `https://storage.sitebank.com/docs/${uploadFileName}`,
      uploadedFileName: uploadFileName,
      agentNotes: agentNotes || undefined,
      updatedAt: new Date().toISOString(),
    });

    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Document Uploaded',
      message: `"${request.documentType}" for ${request.propertyTitle} has been uploaded by Vikram Singh.`,
      type: 'success',
      role: request.requestedByRole,
      read: false,
      createdAt: new Date().toISOString(),
    });

    addActivityLog({
      id: `log-${Date.now()}`,
      action: 'DOCUMENT_UPLOADED',
      description: `Agent uploaded "${request.documentType}" for ${request.propertyTitle} (requested by ${request.requestedByName})`,
      user: 'Vikram Singh',
      role: 'agent',
      timestamp: new Date().toISOString(),
    });

    setUploadModalOpen(false);
  };

  const roleColor = (role: 'lawyer' | 'ca') =>
    role === 'lawyer'
      ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20'
      : 'bg-[#0891b2]/10 text-[#0891b2] border-[#0891b2]/20';

  const roleLabel = (role: 'lawyer' | 'ca') =>
    role === 'lawyer' ? 'Lawyer' : 'Chartered Accountant';

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Document Requests</h1>
        <p className="text-xs sm:text-sm text-[#4A5568]">Lawyers and CAs have requested the following documents for property verification.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Requests', value: myRequests.length, icon: FileText, color: 'text-[#C7A36A]', bg: 'bg-[#C7A36A]/10' },
          { title: 'Pending Upload', value: pendingCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Uploaded', value: uploadedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6 flex items-center gap-4">
            <div className={`p-3 sm:p-4 ${stat.bg} rounded-xl ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <p className="text-[#4A5568] text-xs sm:text-sm font-medium">{stat.title}</p>
              <p className="text-[#2C3E38] text-xl sm:text-2xl font-bold mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['All', 'Pending', 'Uploaded'] as TabFilter[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#2C3E38] text-white'
                : 'bg-white text-[#4A5568] hover:text-[#2C3E38] border border-[#E8DFD6]'
            }`}
          >
            {tab}
            {tab === 'Pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-amber-500 text-white">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-medium text-[#2C3E38]">{req.documentType}</h3>
                    <span className={`px-2.5 py-1 text-xs rounded-md border font-medium ${roleColor(req.requestedByRole)}`}>
                      {roleLabel(req.requestedByRole)}
                    </span>
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : req.status === 'Uploaded'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {req.status === 'Pending' && <Clock className="w-3 h-3 inline mr-1" />}
                      {req.status === 'Uploaded' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[#4A5568] text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 shrink-0" /> {req.propertyTitle}
                  </p>
                  <p className="text-[#4A5568] text-sm flex items-center gap-1">
                    <User className="w-4 h-4 shrink-0" /> Requested by: <span className="font-medium text-[#2C3E38]">{req.requestedByName}</span>
                  </p>
                  <p className="text-[#4A5568] text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3 shrink-0" /> {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {req.status === 'Pending' && (
                  <button
                    onClick={() => openUploadModal(req.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2C3E38] hover:bg-[#1A2622] text-white rounded-full font-medium transition-colors shadow-md shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#E8DFD6]/50 mb-3">
                <p className="text-sm text-[#4A5568] leading-relaxed">{req.description}</p>
              </div>

              {/* Uploaded File Info */}
              {req.status === 'Uploaded' && req.uploadedFileName && (
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">{req.uploadedFileName}</span>
                    </div>
                    <a
                      href={req.uploadedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  </div>
                  {req.agentNotes && (
                    <p className="text-xs text-emerald-600 mt-2 pl-6">Note: {req.agentNotes}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFD6]/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
              <FileText className="w-12 h-12 text-[#C7A36A] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#2C3E38] mb-1">No document requests</h3>
              <p className="text-[#4A5568]">No document requests in this category.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Requested Document">
        <div className="space-y-4">
          {selectedRequestId && (() => {
            const req = documentRequests.find(r => r.id === selectedRequestId);
            if (!req) return null;
            return (
              <>
                <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#E8DFD6]/50">
                  <p className="text-sm font-bold text-[#2C3E38]">{req.documentType}</p>
                  <p className="text-xs text-[#4A5568] mt-1">Property: <span className="font-medium text-[#2C3E38]">{req.propertyTitle}</span></p>
                  <p className="text-xs text-[#4A5568] mt-0.5">Requested by: <span className="font-medium text-[#2C3E38]">{req.requestedByName}</span></p>
                  <p className="text-xs text-[#4A5568] mt-2 italic">&quot;{req.description}&quot;</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C3E38] mb-1">File Name *</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={e => setUploadFileName(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A]"
                    placeholder="e.g., Title_Deed_Property.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C3E38] mb-1">File URL <span className="text-[#4A5568] font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={uploadFileUrl}
                    onChange={e => setUploadFileUrl(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A]"
                    placeholder="https://storage.example.com/document.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C3E38] mb-1">Notes <span className="text-[#4A5568] font-normal">(optional)</span></label>
                  <textarea
                    value={agentNotes}
                    onChange={e => setAgentNotes(e.target.value)}
                    className="w-full bg-white border border-[#E8DFD6] rounded-xl px-4 py-3 text-[#2C3E38] focus:outline-none focus:border-[#C7A36A] focus:ring-1 focus:ring-[#C7A36A] h-24 resize-none"
                    placeholder="Add any notes about the uploaded document..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="px-6 py-2 text-[#4A5568] hover:text-[#2C3E38] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadFileName.trim()}
                    className="px-6 py-2 bg-[#2C3E38] hover:bg-[#1A2622] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Upload & Notify
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

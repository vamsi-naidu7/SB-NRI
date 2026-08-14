"use client";
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import { ShieldCheck, Download, Calendar, ExternalLink, MessageSquare, Scale, Calculator, CheckCircle, AlertTriangle, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const cpStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
    case 'flagged': return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
    case 'in-review': return <Eye className="w-3.5 h-3.5 text-blue-600" />;
    default: return <Clock className="w-3.5 h-3.5 text-[#4A5568]" />;
  }
};

const cpStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'flagged': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'in-review': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

export default function VerificationReports() {
  const { verificationRequests, properties } = useApp();
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs = ['All', 'Submitted', 'In Progress', 'Completed'];

  const filteredRequests = verificationRequests.filter(req => {
    if (filter === 'All') return true;
    if (filter === 'Completed' && req.status === 'Report Uploaded') return true;
    return req.status === filter;
  });

  const getRecommendationColor = (rec?: string) => {
    if (rec === 'Recommended') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (rec === 'Recommended with Conditions') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (rec === 'Not Recommended') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-[#FAF6EF] text-[#4A5568] border-[#E8DFD6]';
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Verification Reports</h1>
        <p className="text-xs sm:text-sm text-[#4A5568]">Track and download comprehensive property verification reports.</p>
      </div>

      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none border-b border-[#E8DFD6]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold transition-colors border-b-2 -mb-[1px] ${
              filter === tab ? 'border-[#C7A36A] text-[#2C3E38]' : 'border-transparent text-[#4A5568] hover:text-[#2C3E38]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <AnimatePresence>
          {filteredRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50"
            >
              <ShieldCheck className="w-12 h-12 text-[#C7A36A] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#2C3E38] mb-1">No requests found</h3>
              <p className="text-[#4A5568]">You don't have any verification requests in this status.</p>
            </motion.div>
          ) : (
            filteredRequests.map((req) => {
              const prop = req.isExternal ? { title: 'External Property Verification', location: { address: 'Details securely stored' } } : properties.find(p => p.id === req.propertyId);
              const isExpanded = expandedId === req.id;
              const checkpoints = req.checkpoints || [];
              const legalCps = checkpoints.filter(cp => cp.assignedTo === 'lawyer' && cp.selected);
              const financialCps = checkpoints.filter(cp => cp.assignedTo === 'ca' && cp.selected);
              const totalSelected = checkpoints.filter(cp => cp.selected).length;
              const totalDone = checkpoints.filter(cp => cp.selected && (cp.status === 'approved' || cp.status === 'flagged')).length;
              const progressPct = totalSelected > 0 ? Math.round((totalDone / totalSelected) * 100) : 0;
              
              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={req.status} />
                          {req.isExternal && (
                            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF6EF] text-[#2C3E38] border border-[#E8DFD6]">
                              <ExternalLink className="w-3 h-3 text-[#C7A36A]" /> External Property
                            </span>
                          )}
                          {(req.status === 'Report Uploaded' || req.status === 'Completed') && req.recommendation && (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRecommendationColor(req.recommendation)}`}>
                              {req.recommendation}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-[#2C3E38] mb-1">{prop?.title || 'Unknown Property'}</h3>
                          <p className="text-sm text-[#4A5568] flex items-center gap-1">
                            {req.propertyAddress || 'Address hidden'}
                          </p>
                        </div>

                        {/* Checkpoint Progress Bar */}
                        {totalSelected > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-[#E8DFD6] rounded-full">
                              <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#0891b2] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-[#2C3E38] whitespace-nowrap">{totalDone}/{totalSelected} verified</span>
                          </div>
                        )}

                        {req.rmComments && (
                          <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#E8DFD6] text-sm text-[#2C3E38]">
                            <div className="flex items-center gap-2 mb-2 text-[#4A5568] font-bold">
                              <MessageSquare className="w-4 h-4 text-[#C7A36A]" /> RM Comments
                            </div>
                            {req.rmComments}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6 text-xs text-[#4A5568] font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C7A36A]" /> Submitted: {new Date(req.dateSubmitted).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C7A36A]" /> Updated: {new Date(req.dateUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-[#E8DFD6] pt-4 md:pt-0 md:pl-6 gap-3">
                        {(req.status === 'Report Uploaded' || req.status === 'Completed') ? (
                          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C3E38] hover:bg-[#2C3E38]/90 text-white font-semibold transition-colors w-full md:w-auto justify-center shadow-md">
                            <Download className="w-4 h-4 text-[#C7A36A]" />
                            Download Report
                          </button>
                        ) : (
                          <div className="text-sm text-[#4A5568] bg-[#FAF6EF] px-4 py-3 rounded-xl border border-[#E8DFD6] text-center font-medium">
                            Report will be available<br/>once completed
                          </div>
                        )}
                        {totalSelected > 0 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                            className="flex items-center gap-1 text-xs font-medium text-[#C7A36A] hover:text-[#C7A36A]/80 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {isExpanded ? 'Hide' : 'View'} Checkpoints
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Checkpoint Details */}
                  <AnimatePresence>
                    {isExpanded && totalSelected > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-[#E8DFD6]"
                      >
                        <div className="p-6 space-y-4 bg-[#FAF6EF]/50">
                          {/* Legal */}
                          {legalCps.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-[#2C3E38] flex items-center gap-2 mb-3">
                                <Scale className="w-4 h-4 text-[#6366f1]" />
                                Legal Checkpoints
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#6366f1]">Lawyer</span>
                              </h4>
                              <div className="grid gap-2">
                                {legalCps.map(cp => (
                                  <div key={cp.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cpStatusColor(cp.status)}`}>
                                    <div className="mt-0.5">{cpStatusIcon(cp.status)}</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium">{cp.name}</p>
                                      {cp.reviewerName && <p className="text-xs opacity-70 mt-0.5">Reviewed by {cp.reviewerName}</p>}
                                      {cp.reviewComments && <p className="text-xs mt-1 opacity-80">{cp.reviewComments}</p>}
                                    </div>
                                    <span className="text-xs font-medium capitalize whitespace-nowrap">{cp.status}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Financial */}
                          {financialCps.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-[#2C3E38] flex items-center gap-2 mb-3">
                                <Calculator className="w-4 h-4 text-[#0891b2]" />
                                Financial Checkpoints
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0891b2]/10 text-[#0891b2]">CA</span>
                              </h4>
                              <div className="grid gap-2">
                                {financialCps.map(cp => (
                                  <div key={cp.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cpStatusColor(cp.status)}`}>
                                    <div className="mt-0.5">{cpStatusIcon(cp.status)}</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium">{cp.name}</p>
                                      {cp.reviewerName && <p className="text-xs opacity-70 mt-0.5">Reviewed by {cp.reviewerName}</p>}
                                      {cp.reviewComments && <p className="text-xs mt-1 opacity-80">{cp.reviewComments}</p>}
                                    </div>
                                    <span className="text-xs font-medium capitalize whitespace-nowrap">{cp.status}</span>
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
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


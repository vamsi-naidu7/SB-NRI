"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertTriangle, Users, Calendar, ArrowRight, FileUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';

const statusLabel = (s: string) => {
  switch (s) {
    case 'pending': return 'Pending';
    case 'in-review': return 'In Review';
    case 'approved': return 'Approved';
    case 'flagged': return 'Flagged';
    default: return s;
  }
};

export default function LawyerDashboard() {
  const { verificationRequests, documentRequests } = useApp();

  const stats = useMemo(() => {
    let pendingReviews = 0;
    let completedReviews = 0;
    let flaggedDocuments = 0;
    const nriIds = new Set<string>();

    verificationRequests.forEach(vr => {
      if (!vr.checkpoints) return;
      const lawyerCps = vr.checkpoints.filter(cp => cp.assignedTo === 'lawyer' && cp.selected);
      lawyerCps.forEach(cp => {
        if (cp.status === 'pending' || cp.status === 'in-review') pendingReviews++;
        if (cp.status === 'approved') completedReviews++;
        if (cp.status === 'flagged') flaggedDocuments++;
      });
      if (lawyerCps.length > 0) nriIds.add(vr.nriId);
    });

    return { pendingReviews, completedReviews, flaggedDocuments, assignedNRIs: nriIds.size };
  }, [verificationRequests]);

  const myDocRequests = useMemo(() => {
    const mine = documentRequests.filter(dr => dr.requestedByRole === 'lawyer');
    return {
      total: mine.length,
      pending: mine.filter(dr => dr.status === 'Pending').length,
      uploaded: mine.filter(dr => dr.status === 'Uploaded').length,
    };
  }, [documentRequests]);

  const recentAssignments = useMemo(() => {
    return verificationRequests
      .filter(vr => vr.checkpoints?.some(cp => cp.assignedTo === 'lawyer' && cp.selected))
      .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
      .slice(0, 5);
  }, [verificationRequests]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E38]">Legal Review Dashboard</h2>
          <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">Overview of your assigned legal verification checkpoints.</p>
        </div>
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 px-3.5 py-2 rounded-xl flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#6366f1] bg-[#6366f1]/5 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-[#6366f1]" />
          </div>
          <div className="text-xs sm:text-sm">
            <p className="text-[#2C3E38] font-semibold">Legal Counsel</p>
            <p className="text-[#4A5568] text-xs">Property Verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div variants={itemVariants}>
          <StatsCard title="Pending Reviews" value={stats.pendingReviews.toString()} icon={Scale} color="text-[#6366f1]" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Completed Reviews" value={stats.completedReviews.toString()} icon={FileCheck} color="text-emerald-600" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Flagged Documents" value={stats.flaggedDocuments.toString()} icon={AlertTriangle} color="text-amber-600" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Assigned NRIs" value={stats.assignedNRIs.toString()} icon={Users} color="text-[#6366f1]" />
        </motion.div>
      </div>

      {/* Document Requests Summary */}
      {myDocRequests.total > 0 && (
        <motion.div variants={itemVariants} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-[#2C3E38] flex items-center gap-2 mb-4">
            <FileUp className="w-5 h-5 text-[#6366f1]" />
            My Document Requests
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#E8DFD6]/50 text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#2C3E38]">{myDocRequests.total}</p>
              <p className="text-xs text-[#4A5568] mt-0.5">Total</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/50 text-center">
              <p className="text-xl sm:text-2xl font-bold text-amber-700">{myDocRequests.pending}</p>
              <p className="text-xs text-amber-600 mt-0.5">Pending</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/50 text-center">
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">{myDocRequests.uploaded}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Uploaded</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#2C3E38] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#6366f1]" />
            Recent Assignments
          </h3>
        </div>
        <div className="space-y-4 divide-y divide-[#E8DFD6]">
          {recentAssignments.length === 0 ? (
            <p className="text-[#4A5568] text-center py-4">No legal review assignments found.</p>
          ) : (
            recentAssignments.map((req) => {
              const lawyerCps = req.checkpoints?.filter(cp => cp.assignedTo === 'lawyer' && cp.selected) || [];
              const completed = lawyerCps.filter(cp => cp.status === 'approved' || cp.status === 'flagged').length;
              return (
                <div key={req.id} className="flex items-center justify-between py-4 hover:bg-[#FAF6EF]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[#2C3E38] font-medium">{req.propertyTitle}</h4>
                      <p className="text-sm text-[#4A5568]">{req.nriName} • {completed}/{lawyerCps.length} checkpoints done</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

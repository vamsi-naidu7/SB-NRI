"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Wrench, FileSignature, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RMDashboard() {
  const { verificationRequests, maintenanceRequests, leaseRequests } = useApp();

  const stats = useMemo(() => {
    const allNriIds = new Set([
      ...verificationRequests.map(r => r.nriId),
      ...maintenanceRequests.map(r => r.nriId),
      ...leaseRequests.map(r => r.nriId)
    ]);

    const pendingVerifications = verificationRequests.filter(r => r.status !== 'Completed').length;
    const scheduledInspections = maintenanceRequests.filter(r => r.status === 'Active').length;
    const pendingLeases = leaseRequests.filter(r => r.status === 'Requested' || r.status === 'Agreement Pending').length;

    const totalRequests = verificationRequests.length + maintenanceRequests.length + leaseRequests.length;
    const completedRequests = 
      verificationRequests.filter(r => r.status === 'Completed').length +
      maintenanceRequests.filter(r => r.status === 'Completed').length +
      leaseRequests.filter(r => r.status === 'Closed').length;
    
    const completionRate = totalRequests ? Math.round((completedRequests / totalRequests) * 100) : 0;

    return {
      assignedNRIs: allNriIds.size,
      pendingVerifications,
      scheduledInspections,
      pendingLeases,
      completionRate
    };
  }, [verificationRequests, maintenanceRequests, leaseRequests]);

  const recentAssignments = useMemo(() => {
    const all = [
      ...verificationRequests.map(r => ({ ...r, dateField: r.dateSubmitted, type: 'Verification' as const })),
      ...maintenanceRequests.map(r => ({ ...r, dateField: r.createdAt, type: 'Maintenance' as const })),
      ...leaseRequests.map(r => ({ ...r, dateField: r.createdAt, type: 'Lease' as const }))
    ];
    return all.sort((a, b) => new Date(b.dateField || 0).getTime() - new Date(a.dateField || 0).getTime()).slice(0, 5);
  }, [verificationRequests, maintenanceRequests, leaseRequests]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E38]">RM Operations Dashboard</h2>
          <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">Overview of your assigned tasks and clients.</p>
        </div>
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 px-3.5 py-2 rounded-xl flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#C7A36A] bg-[#FAF6EF] flex items-center justify-center shrink-0">
            <span className="text-[#C7A36A] font-bold text-sm sm:text-base">{stats.completionRate}%</span>
          </div>
          <div className="text-xs sm:text-sm">
            <p className="text-[#2C3E38] font-semibold">Completion Rate</p>
            <p className="text-[#4A5568] text-xs">Across all tasks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Assigned NRIs"
            value={stats.assignedNRIs.toString()}
            icon={Users}
            color="text-[#C7A36A]"
            trend={{ value: 2, positive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Pending Verifications"
            value={stats.pendingVerifications.toString()}
            icon={FileText}
            color="text-[#C7A36A]"
            trend={{ value: 1, positive: false }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Scheduled Inspections"
            value={stats.scheduledInspections.toString()}
            icon={Wrench}
            color="text-[#C7A36A]"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Pending Leases"
            value={stats.pendingLeases.toString()}
            icon={FileSignature}
            color="text-[#C7A36A]"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#2C3E38] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C7A36A]" />
            Recent Assignments
          </h3>
          <button className="text-sm text-[#C7A36A] hover:text-[#C7A36A]/80 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4 divide-y divide-[#E8DFD6]">
          {recentAssignments.length === 0 ? (
            <p className="text-[#4A5568] text-center py-4">No recent assignments found.</p>
          ) : (
            recentAssignments.map((req, i) => (
              <div key={i} className="flex items-center justify-between py-4 bg-white hover:bg-[#FAF6EF]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    req.type === 'Verification' ? 'bg-[#C7A36A]/10 text-[#C7A36A]' :
                    req.type === 'Maintenance' ? 'bg-[#2C3E38]/10 text-[#2C3E38]' :
                    'bg-[#C7A36A]/10 text-[#C7A36A]'
                  }`}>
                    {req.type === 'Verification' ? <FileText className="w-5 h-5" /> :
                     req.type === 'Maintenance' ? <Wrench className="w-5 h-5" /> :
                     <FileSignature className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-[#2C3E38] font-medium">{req.propertyTitle || 'Property Request'}</h4>
                    <p className="text-sm text-[#4A5568]">{req.nriName} • {req.type}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

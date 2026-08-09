"use client";
import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Building, ShieldCheck, Wrench, FileText, ArrowRight, Activity, Bell } from 'lucide-react';

export default function NRIDashboard() {
  const { properties, verificationRequests, maintenanceRequests, leaseRequests, notifications } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const nriNotifications = notifications.filter(n => n.role === 'nri').slice(0, 5);

  const quickActions = [
    { title: 'Browse Properties', description: 'Explore verified properties across India', icon: Building },
    { title: 'Request Verification', description: 'Verify a property before purchase', icon: ShieldCheck },
    { title: 'Request Maintenance', description: 'Schedule maintenance for your property', icon: Wrench },
    { title: 'Manage Leases', description: 'Track rent and lease agreements', icon: FileText },
  ];

  const statCards = [
    { title: "My Properties", value: properties.length, icon: Building },
    { title: "Active Verifications", value: verificationRequests.length, icon: ShieldCheck },
    { title: "Ongoing Maintenances", value: maintenanceRequests.length, icon: Wrench },
    { title: "Active Leases", value: leaseRequests.length, icon: FileText }
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E38] mb-1">Welcome Back</h1>
        <p className="text-sm text-[#4A5568]">Here's what's happening with your properties today.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-3.5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#C7A36A]/10 text-[#C7A36A] flex items-center justify-center shrink-0">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#4A5568] line-clamp-1">{stat.title}</p>
              <h4 className="text-xl sm:text-2xl font-bold text-[#2C3E38] mt-0.5">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C7A36A]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-start gap-3.5 p-4 sm:p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 text-left hover:shadow-md transition-all group"
              >
                <div className={`p-2.5 sm:p-3 rounded-xl bg-[#FAF6EF] text-[#C7A36A] shrink-0`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[#2C3E38] mb-0.5">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] line-clamp-2">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A5568] group-hover:text-[#C7A36A] transition-colors shrink-0 mt-1" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#2C3E38] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C7A36A]" />
            Recent Activity
          </h2>
          <motion.div 
            variants={itemVariants}
            className="p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50"
          >
            {nriNotifications.length > 0 ? (
              <div className="space-y-4">
                {nriNotifications.map((notif, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#FAF6EF] border-l-4 border-[#C7A36A]">
                    <div>
                      <p className="text-[#2C3E38] font-medium text-sm">{notif.title}</p>
                      <p className="text-xs text-[#4A5568] mt-1">{notif.message}</p>
                      <p className="text-xs text-[#4A5568] mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#4A5568] text-center py-4">No recent activity</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

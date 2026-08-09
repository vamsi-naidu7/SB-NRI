"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Home, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AgentDashboard() {
  const { properties, verificationRequests } = useApp();
  const [filter, setFilter] = useState<'All' | 'Draft' | 'Listed' | 'Verification In Progress' | 'Sold'>('All');
  
  const agentId = 'agent-1';
  const myProperties = properties.filter(p => p.agentId === agentId);
  const listedCount = myProperties.filter(p => p.status === 'Listed').length;
  // Count verification requests for agent's properties
  const agentPropIds = myProperties.map(p => p.id);
  const vReqCount = verificationRequests.filter(vr => vr.propertyId && agentPropIds.includes(vr.propertyId)).length;
  
  const filteredProperties = filter === 'All' 
    ? myProperties 
    : myProperties.filter(p => p.status === filter);
    
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E38] mb-2">Agent Dashboard</h1>
          <p className="text-[#4A5568]">Overview of your property portfolio</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#2C3E38] text-white rounded-full font-medium hover:bg-[#2C3E38]/90 transition-all shadow-md">
          <Plus size={20} />
          <span>Upload New Property</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "My Listings", value: myProperties.length, icon: Home },
          { title: "Listed Properties", value: listedCount, icon: CheckCircle },
          { title: "Verification Requests", value: vReqCount, icon: Clock },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-4 sm:p-6 flex items-center gap-4">
            <div className="p-3 sm:p-4 bg-[#C7A36A]/10 rounded-xl text-[#C7A36A] shrink-0">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <p className="text-[#4A5568] text-xs sm:text-sm font-medium">{stat.title}</p>
              <p className="text-[#2C3E38] text-xl sm:text-2xl font-bold mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Properties Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6] rounded-2xl overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-[#E8DFD6]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#2C3E38]">My Properties</h2>
            
            {/* Filter Tabs */}
            <div className="flex border-b border-[#E8DFD6] overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {['All', 'Draft', 'Listed', 'Verification In Progress', 'Sold'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === tab 
                      ? 'border-b-2 border-[#C7A36A] text-[#2C3E38] font-bold' 
                      : 'text-[#4A5568] hover:text-[#2C3E38]'
                  }`}
                >
                  {tab === 'Verification In Progress' ? 'Verifying' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6EF] text-[#4A5568] text-sm">
                <th className="p-4 font-medium">Property</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Listed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD6]">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop, idx) => (
                  <motion.tr 
                    key={prop.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[#FAF6EF] transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-[#2C3E38]">{prop.title}</div>
                      <div className="text-xs text-[#4A5568] truncate max-w-[200px]">{prop.id}</div>
                    </td>
                    <td className="p-4 text-[#4A5568] font-medium">{prop.type}</td>
                    <td className="p-4">
                      <div className="text-[#2C3E38] font-medium">{prop.city}</div>
                      <div className="text-xs text-[#4A5568]">{prop.state}</div>
                    </td>
                    <td className="p-4 font-bold text-[#2C3E38]">
                      ₹{prop.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={prop.status} />
                    </td>
                    <td className="p-4 text-[#4A5568] text-sm">
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#4A5568]">
                    No properties found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

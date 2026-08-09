'use client';

import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Building2, 
  FileCheck, 
  Wrench, 
  FileText, 
  IndianRupee, 
  Users,
  ScrollText,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function AdminDashboard() {
  const { properties, verificationRequests, maintenanceRequests, leaseRequests, activityLogs } = useApp();

  // Calculate KPIs
  const totalProperties = properties?.length || 0;
  const activeVerifications = verificationRequests?.filter(r => r.status !== 'Completed').length || 0;
  const activeMaintenance = maintenanceRequests?.filter(r => r.status !== 'Completed').length || 0;
  const activeLeases = leaseRequests?.filter(r => r.status === 'Active' || r.status === 'Renewal Due').length || 0;
  
  const totalRevenue = leaseRequests?.reduce((sum, req) => {
    const paidAmount = req.monthlyRentPayouts?.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0) || 0;
    return sum + paidAmount;
  }, 0) || 0;

  const totalNris = useMemo(() => {
    const nriNames = new Set([
      ...(verificationRequests?.map(r => r.nriName) || []),
      ...(maintenanceRequests?.map(r => r.nriName) || []),
      ...(leaseRequests?.map(r => r.nriName) || []),
    ]);
    return nriNames.size;
  }, [verificationRequests, maintenanceRequests, leaseRequests]);

  // Chart Data
  const revenueData = useMemo(() => [
    { name: 'Mar', value: totalRevenue * 0.15 || 45000 },
    { name: 'Apr', value: totalRevenue * 0.18 || 52000 },
    { name: 'May', value: totalRevenue * 0.16 || 48000 },
    { name: 'Jun', value: totalRevenue * 0.22 || 61000 },
    { name: 'Jul', value: totalRevenue * 0.19 || 59000 },
    { name: 'Aug', value: totalRevenue * 0.10 || 30000 },
  ], [totalRevenue]);

  const serviceData = useMemo(() => [
    { name: 'Verifications', value: verificationRequests?.length || 0 },
    { name: 'Maintenance', value: maintenanceRequests?.length || 0 },
    { name: 'Leases', value: leaseRequests?.length || 0 },
  ], [verificationRequests, maintenanceRequests, leaseRequests]);
  const SERVICE_COLORS = ['#2C3E38', '#C7A36A', '#4A9B7F', '#E8916D'];

  const propertyTypeData = useMemo(() => [
    { name: 'Apartment', value: properties?.filter(p => p.type === 'Apartment').length || 0 },
    { name: 'Villa', value: properties?.filter(p => p.type === 'Villa').length || 0 },
    { name: 'Plot', value: properties?.filter(p => p.type === 'Plot').length || 0 },
    { name: 'Commercial', value: properties?.filter(p => p.type === 'Commercial').length || 0 },
  ], [properties]);

  // Helpers for table
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-[#2C3E38]/10 text-[#2C3E38] border-[#2C3E38]/20';
      case 'rm': return 'bg-[#C7A36A]/10 text-[#C7A36A] border-[#C7A36A]/20';
      case 'agent': return 'bg-[#4A9B7F]/10 text-[#4A9B7F] border-[#4A9B7F]/20';
      case 'nri': return 'bg-[#E8916D]/10 text-[#E8916D] border-[#E8916D]/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg border border-[#E8DFD6] rounded-xl p-3">
          <p className="text-[#4A5568] text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[#2C3E38] font-bold">
              {entry.name === 'value' ? 'Revenue' : entry.name}: {entry.name === 'value' ? `₹${Number(entry.value).toLocaleString('en-IN')}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. KPI Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { title: "Total Properties", value: totalProperties, icon: Building2 },
          { title: "Active Verifications", value: activeVerifications, icon: FileCheck },
          { title: "Maintenance Active", value: activeMaintenance, icon: Wrench },
          { title: "Active Leases", value: activeLeases, icon: FileText },
          { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee },
          { title: "Total NRIs", value: totalNris, icon: Users },
        ].map((kpi, index) => (
          <div key={index} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C7A36A]/10 rounded-xl flex items-center justify-center text-[#C7A36A]">
              <kpi.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[#4A5568] text-xs sm:text-sm font-medium line-clamp-1">{kpi.title}</p>
              <p className="text-[#2C3E38] text-lg sm:text-xl font-bold mt-0.5 truncate">{kpi.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 2. Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: Monthly Revenue Trend */}
        <div className="lg:col-span-2 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block">
              Monthly Revenue Trend
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
            </h3>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C7A36A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C7A36A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD6" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4A5568" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#4A5568" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#C7A36A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Service Distribution */}
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block mb-6">
            Service Distribution
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
          </h3>
          <div className="flex-1 min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#4A5568' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Chart C & Activity Log Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart C: Property Types */}
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block mb-8">
            Properties by Type
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyTypeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD6" vertical={false} />
                <XAxis dataKey="name" stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#FAF6EF' }} />
                <Bar dataKey="value" fill="#2C3E38" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Recent Activity Log Table */}
        <div className="lg:col-span-2 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#C7A36A]/10 text-[#C7A36A] rounded-lg">
              <ScrollText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block">
              Recent Activity
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-auto max-h-[300px] pr-2 custom-scrollbar">
            {(!activityLogs || activityLogs.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-[#4A5568]">
                <Clock className="w-8 h-8 mb-2 opacity-20" />
                <p>No recent activity found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8DFD6]">
                {activityLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-[#FAF6EF] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#2C3E38] truncate">{log.user}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRoleColor(log.role)} uppercase tracking-wider`}>
                          {log.role}
                        </span>
                        <span className="text-xs text-[#4A5568] ml-auto whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-[#2C3E38] font-medium">{log.action}</p>
                      <p className="text-xs text-[#4A5568] mt-0.5 truncate">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4. Recent Requests Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Verifications */}
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block">
              Recent Verifications
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
            </h3>
            <button className="text-sm text-[#C7A36A] hover:text-[#2C3E38] font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {verificationRequests?.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E8DFD6] hover:border-[#C7A36A] transition-colors">
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-bold text-[#2C3E38] truncate">{req.propertyTitle}</p>
                  <p className="text-xs text-[#4A5568] mt-1">{req.nriName}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={req.status} />
                  <span className="text-[10px] text-[#4A5568]">{formatDate(req.dateSubmitted)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2C3E38] relative inline-block">
              Recent Maintenance
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C7A36A] rounded-full"></span>
            </h3>
            <button className="text-sm text-[#C7A36A] hover:text-[#2C3E38] font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {maintenanceRequests?.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E8DFD6] hover:border-[#C7A36A] transition-colors">
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-bold text-[#2C3E38] truncate">{req.propertyTitle}</p>
                  <p className="text-xs text-[#4A5568] mt-1">{req.nriName}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={req.status} />
                  <span className="text-[10px] text-[#4A5568]">Recently</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';

// Admin
import AdminDashboard from '@/components/admin/AdminDashboard';

// NRI
import NRIDashboard from '@/components/nri/NRIDashboard';
import PropertyCatalog from '@/components/nri/PropertyCatalog';
import PropertyDetails from '@/components/nri/PropertyDetails';
import VerificationReports from '@/components/nri/VerificationReports';
import MaintenanceHub from '@/components/nri/MaintenanceHub';
import LeaseManagement from '@/components/nri/LeaseManagement';
import UploadOutsideProperty from '@/components/nri/UploadOutsideProperty';

// RM
import RMDashboard from '@/components/rm/RMDashboard';
import VerificationWorkflow from '@/components/rm/VerificationWorkflow';
import MaintenanceWorkflow from '@/components/rm/MaintenanceWorkflow';
import LeaseWorkflow from '@/components/rm/LeaseWorkflow';
import CustomerChat from '@/components/rm/CustomerChat';

// Agent
import AgentDashboard from '@/components/agent/AgentDashboard';
import UploadProperty from '@/components/agent/UploadProperty';

export default function Home() {
  const { currentRole } = useApp();
  const [activeSection, setActiveSection] = useState(`${currentRole}-dashboard`);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Reset to dashboard when role changes
  useEffect(() => {
    setActiveSection(`${currentRole}-dashboard`);
    setSelectedPropertyId(null);
  }, [currentRole]);

  const handleViewProperty = (id: string) => {
    setSelectedPropertyId(id);
    setActiveSection('nri-property-details');
  };

  const renderContent = () => {
    switch (activeSection) {
      // Admin - AdminDashboard contains all admin content (KPIs, charts, logs)
      case 'admin-dashboard':
      case 'admin-analytics':
      case 'admin-users':
      case 'admin-activity':
        return <AdminDashboard />;

      // NRI
      case 'nri-dashboard':
        return <NRIDashboard />;
      case 'nri-catalog':
        return <PropertyCatalog onViewProperty={handleViewProperty} />;
      case 'nri-property-details':
        return selectedPropertyId ? (
          <PropertyDetails propertyId={selectedPropertyId} onBack={() => setActiveSection('nri-catalog')} />
        ) : (
          <PropertyCatalog onViewProperty={handleViewProperty} />
        );
      case 'nri-verifications':
        return <VerificationReports />;
      case 'nri-maintenance':
        return <MaintenanceHub />;
      case 'nri-leases':
        return <LeaseManagement />;
      case 'nri-reports':
        return <UploadOutsideProperty />;

      // RM
      case 'rm-dashboard':
        return <RMDashboard />;
      case 'rm-verifications':
        return <VerificationWorkflow />;
      case 'rm-maintenance':
        return <MaintenanceWorkflow />;
      case 'rm-leases':
        return <LeaseWorkflow />;
      case 'rm-messages':
        return <CustomerChat />;

      // Agent
      case 'agent-dashboard':
        return <AgentDashboard />;
      case 'agent-listings':
        return <AgentDashboard />;
      case 'agent-upload':
        return <UploadProperty />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-1 relative min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 ml-0 md:ml-64 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

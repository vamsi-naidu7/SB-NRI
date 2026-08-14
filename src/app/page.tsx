'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
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
import DocumentRequests from '@/components/agent/DocumentRequests';

// Lawyer
import LawyerDashboard from '@/components/lawyer/LawyerDashboard';
import LegalReviewWorkflow from '@/components/lawyer/LegalReviewWorkflow';

// Chartered Accountant
import CADashboard from '@/components/ca/CADashboard';
import FinancialReviewWorkflow from '@/components/ca/FinancialReviewWorkflow';

export default function Home() {
  const { currentRole, setCurrentRole } = useApp();
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [activeSection, setActiveSection] = useState(currentRole === 'nri' ? 'nri-catalog' : `${currentRole}-dashboard`);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Sync currentRole from auth when user logs in
  useEffect(() => {
    if (isAuthenticated && userRole) {
      setCurrentRole(userRole);
    }
  }, [isAuthenticated, userRole, setCurrentRole]);

  // Reset to dashboard when role changes
  useEffect(() => {
    setActiveSection(currentRole === 'nri' ? 'nri-catalog' : `${currentRole}-dashboard`);
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
      case 'agent-documents':
        return <DocumentRequests />;

      // Lawyer
      case 'lawyer-dashboard':
        return <LawyerDashboard />;
      case 'lawyer-reviews':
        return <LegalReviewWorkflow />;

      // Chartered Accountant
      case 'ca-dashboard':
        return <CADashboard />;
      case 'ca-reviews':
        return <FinancialReviewWorkflow />;

      default:
        return <AdminDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF6EF]">
        <div className="w-10 h-10 border-4 border-[#C7A36A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="flex flex-1 relative min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 ml-0 md:ml-64 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

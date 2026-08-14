'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ScrollText,
  Search,
  FileCheck,
  Wrench,
  FileText,
  Download,
  ClipboardCheck,
  MessageSquare,
  Building2,
  PlusCircle,
  X,
  ShieldCheck,
  Scale,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { currentRole, isMobileMenuOpen, closeMobileMenu } = useApp();

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'admin-users', label: 'Users', icon: Users },
          { id: 'admin-activity', label: 'Activity Log', icon: ScrollText },
        ];
      case 'nri':
        return [
          { id: 'nri-catalog', label: 'Property Catalog', icon: Search },
          { id: 'nri-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'nri-verifications', label: 'My Verifications', icon: FileCheck },
          { id: 'nri-maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'nri-leases', label: 'Leases', icon: FileText },
          { id: 'nri-reports', label: 'Reports', icon: Download },
        ];
      case 'rm':
        return [
          { id: 'rm-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'rm-verifications', label: 'Verifications', icon: ClipboardCheck },
          { id: 'rm-maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'rm-leases', label: 'Leases', icon: FileText },
          { id: 'rm-messages', label: 'Messages', icon: MessageSquare },
        ];
      case 'agent':
        return [
          { id: 'agent-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'agent-listings', label: 'My Listings', icon: Building2 },
          { id: 'agent-upload', label: 'Upload Property', icon: PlusCircle },
        ];
      case 'lawyer':
        return [
          { id: 'lawyer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'lawyer-reviews', label: 'Legal Reviews', icon: Scale },
        ];
      case 'ca':
        return [
          { id: 'ca-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'ca-reviews', label: 'Financial Reviews', icon: Calculator },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Reset to default section when role changes
  useEffect(() => {
    const defaultSection = navItems[0]?.id;
    if (defaultSection && !navItems.find(item => item.id === activeSection)) {
      onSectionChange(defaultSection);
    }
  }, [currentRole, navItems, activeSection, onSectionChange]);

  const handleSelect = (id: string) => {
    onSectionChange(id);
    closeMobileMenu();
  };

  const renderNavButtons = (isMobile: boolean = false) => (
    <nav className="p-4 flex flex-col gap-1.5 mt-1">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#C7A36A] bg-[#C7A36A]/10 font-semibold shadow-2xs'
                : 'text-[#4A5568] hover:text-[#2C3E38] hover:bg-[#FAF6EF]'
            }`}
          >
            {isActive && !isMobile && (
              <motion.div
                layoutId="activeTabDesktop"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C7A36A] rounded-l-full"
              />
            )}
            {isActive && isMobile && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C7A36A] rounded-r-full" />
            )}
            <item.icon size={20} className={isActive ? "text-[#C7A36A]" : "text-[#4A5568]"} />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-[#E8DFD6]/50 overflow-y-auto z-30 shadow-xs">
        {renderNavButtons(false)}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 border-r border-[#E8DFD6] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-[#E8DFD6] flex items-center justify-between bg-[#FAF6EF]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2C3E38] text-white uppercase tracking-wider">
                    {currentRole} Mode
                  </span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl hover:bg-white text-[#4A5568] hover:text-[#2C3E38] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderNavButtons(true)}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


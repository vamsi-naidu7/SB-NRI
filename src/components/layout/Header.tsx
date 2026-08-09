'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, Bell, X, Check, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentRole, setCurrentRole, notifications, markNotificationRead, isMobileMenuOpen, toggleMobileMenu } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'nri', label: 'NRI' },
    { id: 'rm', label: 'RM' },
    { id: 'agent', label: 'Agent' }
  ] as const;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E8DFD6]/40 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-[#2C3E38] hover:bg-[#FAF6EF] transition-colors rounded-xl flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 text-[#2C3E38] bg-[#FAF6EF] rounded-xl border border-[#E8DFD6]/60">
              <Building2 size={20} className="text-[#C7A36A]" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="text-[#2C3E38]">Site</span>
              <span className="text-[#C7A36A]">Bank</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#FAF6EF] p-1 rounded-xl border border-[#E8DFD6]/60 max-w-[200px] xs:max-w-none overflow-x-auto scrollbar-none">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  currentRole === role.id
                    ? 'bg-[#2C3E38] text-white shadow-xs'
                    : 'text-[#2C3E38] hover:bg-white/60'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2 text-[#2C3E38] hover:bg-[#FAF6EF] transition-colors rounded-full shrink-0"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C7A36A] border-2 border-white rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Notification Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 border-l border-[#E8DFD6] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-[#E8DFD6] flex items-center justify-between">
                <h3 className="font-bold text-[#2C3E38]">Notifications</h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-[#FAF6EF] text-[#4A5568] hover:text-[#2C3E38]"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {notifications.length === 0 ? (
                  <p className="text-[#4A5568] text-sm text-center py-8">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border ${
                        notif.read ? 'bg-white border-[#E8DFD6]/30' : 'bg-[#FAF6EF] border-[#C7A36A]/30'
                      }`}
                    >
                      <p className={`text-sm ${notif.read ? 'text-[#4A5568]' : 'text-[#2C3E38] font-medium'}`}>
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#4A5568]">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="p-1 hover:bg-[#C7A36A]/10 rounded text-[#C7A36A]"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

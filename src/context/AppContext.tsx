'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Property,
  VerificationRequest,
  MaintenanceRequest,
  LeaseRequest,
  Notification,
  ChatMessage,
  ActivityLog,
} from '@/types';
import {
  mockProperties,
  mockVerificationRequests,
  mockMaintenanceRequests,
  mockLeaseRequests,
  mockNotifications,
  mockActivityLogs,
  mockChatMessages,
} from '@/data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  verificationRequests: VerificationRequest[];
  addVerificationRequest: (request: VerificationRequest) => void;
  updateVerificationRequest: (id: string, updates: Partial<VerificationRequest>) => void;
  maintenanceRequests: MaintenanceRequest[];
  addMaintenanceRequest: (request: MaintenanceRequest) => void;
  updateMaintenanceRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  leaseRequests: LeaseRequest[];
  addLeaseRequest: (request: LeaseRequest) => void;
  updateLeaseRequest: (id: string, updates: Partial<LeaseRequest>) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  activityLogs: ActivityLog[];
  addActivityLog: (log: ActivityLog) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('nri');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [leaseRequests, setLeaseRequests] = useState<LeaseRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      const storedRole = localStorage.getItem('sb_currentRole');
      if (storedRole) setCurrentRole(storedRole as UserRole);

      const storedProperties = localStorage.getItem('sb_properties');
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      } else {
        setProperties(mockProperties);
        localStorage.setItem('sb_properties', JSON.stringify(mockProperties));
      }

      const storedVerificationRequests = localStorage.getItem('sb_verificationRequests');
      if (storedVerificationRequests) {
        setVerificationRequests(JSON.parse(storedVerificationRequests));
      } else {
        setVerificationRequests(mockVerificationRequests);
        localStorage.setItem('sb_verificationRequests', JSON.stringify(mockVerificationRequests));
      }

      const storedMaintenanceRequests = localStorage.getItem('sb_maintenanceRequests');
      if (storedMaintenanceRequests) {
        setMaintenanceRequests(JSON.parse(storedMaintenanceRequests));
      } else {
        setMaintenanceRequests(mockMaintenanceRequests);
        localStorage.setItem('sb_maintenanceRequests', JSON.stringify(mockMaintenanceRequests));
      }

      const storedLeaseRequests = localStorage.getItem('sb_leaseRequests');
      if (storedLeaseRequests) {
        setLeaseRequests(JSON.parse(storedLeaseRequests));
      } else {
        setLeaseRequests(mockLeaseRequests);
        localStorage.setItem('sb_leaseRequests', JSON.stringify(mockLeaseRequests));
      }

      const storedNotifications = localStorage.getItem('sb_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        setNotifications(mockNotifications);
        localStorage.setItem('sb_notifications', JSON.stringify(mockNotifications));
      }

      const storedChatMessages = localStorage.getItem('sb_chatMessages');
      if (storedChatMessages) {
        setChatMessages(JSON.parse(storedChatMessages));
      } else {
        setChatMessages(mockChatMessages);
        localStorage.setItem('sb_chatMessages', JSON.stringify(mockChatMessages));
      }

      const storedActivityLogs = localStorage.getItem('sb_activityLogs');
      if (storedActivityLogs) {
        setActivityLogs(JSON.parse(storedActivityLogs));
      } else {
        setActivityLogs(mockActivityLogs);
        localStorage.setItem('sb_activityLogs', JSON.stringify(mockActivityLogs));
      }
    };

    loadState();
  }, []);

  // Persist state changes
  useEffect(() => { localStorage.setItem('sb_currentRole', currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem('sb_properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('sb_verificationRequests', JSON.stringify(verificationRequests)); }, [verificationRequests]);
  useEffect(() => { localStorage.setItem('sb_maintenanceRequests', JSON.stringify(maintenanceRequests)); }, [maintenanceRequests]);
  useEffect(() => { localStorage.setItem('sb_leaseRequests', JSON.stringify(leaseRequests)); }, [leaseRequests]);
  useEffect(() => { localStorage.setItem('sb_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('sb_chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('sb_activityLogs', JSON.stringify(activityLogs)); }, [activityLogs]);

  // Actions
  const addProperty = (property: Property) => setProperties(prev => [property, ...prev]);
  const updateProperty = (id: string, updates: Partial<Property>) => setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const addVerificationRequest = (request: VerificationRequest) => setVerificationRequests(prev => [request, ...prev]);
  const updateVerificationRequest = (id: string, updates: Partial<VerificationRequest>) => setVerificationRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  const addMaintenanceRequest = (request: MaintenanceRequest) => setMaintenanceRequests(prev => [request, ...prev]);
  const updateMaintenanceRequest = (id: string, updates: Partial<MaintenanceRequest>) => setMaintenanceRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  const addLeaseRequest = (request: LeaseRequest) => setLeaseRequests(prev => [request, ...prev]);
  const updateLeaseRequest = (id: string, updates: Partial<LeaseRequest>) => setLeaseRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  const addNotification = (notification: Notification) => setNotifications(prev => [notification, ...prev]);
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const addChatMessage = (message: ChatMessage) => setChatMessages(prev => [...prev, message]);
  const addActivityLog = (log: ActivityLog) => setActivityLogs(prev => [log, ...prev]);

  const value: AppContextType = {
    currentRole, setCurrentRole,
    isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu, closeMobileMenu,
    properties, addProperty, updateProperty,
    verificationRequests, addVerificationRequest, updateVerificationRequest,
    maintenanceRequests, addMaintenanceRequest, updateMaintenanceRequest,
    leaseRequests, addLeaseRequest, updateLeaseRequest,
    notifications, addNotification, markNotificationRead,
    chatMessages, addChatMessage,
    activityLogs, addActivityLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Alias for convenience - many components import this name
export const useApp = useAppContext;

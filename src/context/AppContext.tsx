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
import { apiClient } from '@/lib/api';
import { propertyService } from '@/lib/services/propertyService';
import { verificationService } from '@/lib/services/verificationService';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { leaseService } from '@/lib/services/leaseService';
import { 
  mapBackendProperty, 
  mapBackendVerification, 
  mapBackendMaintenance, 
  mapBackendLease 
} from '@/lib/adapters';

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

  // Load from database on mount
  useEffect(() => {
    const loadState = async () => {
      const storedRole = localStorage.getItem('sb_currentRole');
      if (storedRole) setCurrentRole(storedRole as UserRole);

      if (apiClient.isAuthenticated()) {
        try {
          const [dbProps, dbVerifs, dbMaint, dbLeases] = await Promise.all([
            propertyService.getAll(),
            verificationService.getAll(),
            maintenanceService.getAll(),
            leaseService.getAll(),
          ]);

          if (dbProps.length > 0) setProperties(dbProps.map(mapBackendProperty));
          else setProperties(mockProperties);

          if (dbVerifs.length > 0) setVerificationRequests(dbVerifs.map(mapBackendVerification));
          else setVerificationRequests(mockVerificationRequests);

          if (dbMaint.length > 0) setMaintenanceRequests(dbMaint.map(mapBackendMaintenance));
          else setMaintenanceRequests(mockMaintenanceRequests);

          if (dbLeases.length > 0) setLeaseRequests(dbLeases.map(mapBackendLease));
          else setLeaseRequests(mockLeaseRequests);

          // Notifications, chat, activity logs - keep mock for now
          setNotifications(mockNotifications);
          setChatMessages(mockChatMessages);
          setActivityLogs(mockActivityLogs);
        } catch (error) {
          console.warn('Failed to load from API, using mock data');
          setProperties(mockProperties);
          setVerificationRequests(mockVerificationRequests);
          setMaintenanceRequests(mockMaintenanceRequests);
          setLeaseRequests(mockLeaseRequests);
          setNotifications(mockNotifications);
          setChatMessages(mockChatMessages);
          setActivityLogs(mockActivityLogs);
        }
      } else {
        // Not authenticated - use mock data for preview
        setProperties(mockProperties);
        setVerificationRequests(mockVerificationRequests);
        setMaintenanceRequests(mockMaintenanceRequests);
        setLeaseRequests(mockLeaseRequests);
        setNotifications(mockNotifications);
        setChatMessages(mockChatMessages);
        setActivityLogs(mockActivityLogs);
      }
    };

    loadState();
  }, []);

  // Persist state changes (optional, since we now have a DB, but keeps it snappy)
  useEffect(() => { localStorage.setItem('sb_currentRole', currentRole); }, [currentRole]);

  // Actions (Optimistic UI updates)
  const addProperty = (property: Property) => {
    setProperties(prev => [property, ...prev]);
    // Fire API call in background
    propertyService.create({
      title: property.title,
      type: property.type.toUpperCase(),
      price: property.price,
      address: property.address,
      area: property.plotAreaSqFt,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      description: property.description,
    }).catch(err => console.warn('Failed to save property to API:', err));
  };
  const updateProperty = (id: string, updates: Partial<Property>) => setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  
  const addVerificationRequest = (request: VerificationRequest) => {
    setVerificationRequests(prev => [request, ...prev]);
    if (request.propertyId) {
      verificationService.requestVerification(request.propertyId)
        .catch(err => console.warn('Failed to save verification to API:', err));
    }
  };
  const updateVerificationRequest = (id: string, updates: Partial<VerificationRequest>) => setVerificationRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  
  const addMaintenanceRequest = (request: MaintenanceRequest) => {
    setMaintenanceRequests(prev => [request, ...prev]);
    maintenanceService.create({
      propertyId: request.propertyId,
      description: request.requirements,
    }).catch(err => console.warn('Failed to save maintenance to API:', err));
  };
  const updateMaintenanceRequest = (id: string, updates: Partial<MaintenanceRequest>) => setMaintenanceRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  
  const addLeaseRequest = (request: LeaseRequest) => {
    setLeaseRequests(prev => [request, ...prev]);
    leaseService.create({
      propertyId: request.propertyId,
      expectedRent: request.expectedMonthlyRent,
      specialConditions: request.specialConditions,
    }).catch(err => console.warn('Failed to save lease to API:', err));
  };
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

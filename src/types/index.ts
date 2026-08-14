export type UserRole = 'admin' | 'nri' | 'rm' | 'agent' | 'lawyer' | 'ca';

export type CheckpointCategory = 'legal' | 'financial';
export type CheckpointStatus = 'pending' | 'in-review' | 'approved' | 'flagged';

export interface VerificationCheckpoint {
  id: string;
  category: CheckpointCategory;
  name: string;
  description: string;
  assignedTo: 'lawyer' | 'ca';
  status: CheckpointStatus;
  selected: boolean;
  reviewerName?: string;
  reviewComments?: string;
  reviewDate?: string;
}

export interface Property {
  id: string;
  title: string;
  type: 'Apartment' | 'Villa' | 'Plot' | 'Commercial';
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapUrl: string;
  description: string;
  images: string[];
  videos: string[];
  plotAreaSqFt: number;
  builtUpAreaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  ownerDetails: { name: string; contact: string; email: string };
  agentId: string;
  agentName: string;
  status: 'Draft' | 'Listed' | 'Verification In Progress' | 'Sold';
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage?: string;
  isExternal: boolean;
  outsidePropertyDetails?: {
    id: string;
    title: string;
    nriId: string;
    address: string;
    city: string;
    sellerDetails: { name: string; contact: string; email: string };
    documents: { id: string; name: string; size: string; url: string; type: string }[];
    images: string[];
    notes: string;
  };
  nriId: string;
  nriName: string;
  nriEmail: string;
  assignedRmId: string;
  assignedRmName: string;
  status: 'Submitted' | 'Assigned' | 'Verification In Progress' | 'Report Uploaded' | 'Completed';
  recommendation?: 'Recommended' | 'Recommended with Conditions' | 'Not Recommended';
  verificationReportPdf?: string;
  rmImages?: string[];
  rmComments?: string;
  checkpoints?: VerificationCheckpoint[];
  dateSubmitted: string;
  dateUpdated: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  nriId: string;
  nriName: string;
  requirements: string;
  assignedRmId: string;
  assignedRmName: string;
  status: 'Requested' | 'Active' | 'Monthly Inspection Completed' | 'Issue Reported' | 'Completed';
  monthlyInspections: MonthlyInspection[];
  emergencyInspections: EmergencyInspection[];
  createdAt: string;
}

export interface MonthlyInspection {
  id: string;
  month: string;
  date: string;
  photos: string[];
  videos: string[];
  reportPdf: string;
  comments: string;
}

export interface EmergencyInspection {
  id: string;
  date: string;
  issueTitle: string;
  issueDetails: string;
  photos: string[];
  repairRecommendation: string;
  estimatedCost: number;
  status: 'Reported' | 'In Progress' | 'Resolved';
}

export interface LeaseRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  nriId: string;
  nriName: string;
  leaseDurationMonths: number;
  expectedMonthlyRent: number;
  specialConditions: string;
  occupancyType: 'Long Term Rental' | 'Serviced Apartment' | 'Airbnb / Short Term';
  assignedRmId: string;
  assignedRmName: string;
  agreementCopyPdf?: string;
  status: 'Requested' | 'Agreement Pending' | 'Active' | 'Renewal Due' | 'Renewed' | 'Closed';
  monthlyRentPayouts: RentPayout[];
  createdAt: string;
}

export interface RentPayout {
  id: string;
  month: string;
  amount: number;
  status: 'Paid' | 'Pending';
  payoutDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  role: UserRole;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  role: UserRole;
  timestamp: string;
}

export type DocumentRequestStatus = 'Pending' | 'Uploaded' | 'Rejected';

export interface DocumentRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  requestedBy: string;
  requestedByName: string;
  requestedByRole: 'lawyer' | 'ca';
  targetAgentId: string;
  targetAgentName: string;
  documentType: string;
  description: string;
  status: DocumentRequestStatus;
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  agentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

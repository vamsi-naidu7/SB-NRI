import { Property, VerificationRequest, MaintenanceRequest, LeaseRequest } from '@/types';

// Map backend PropertyType enum to frontend type strings
const propertyTypeMap: Record<string, Property['type']> = {
  'APARTMENT': 'Apartment',
  'VILLA': 'Villa',
  'PLOT': 'Plot',
  'COMMERCIAL': 'Commercial',
  'RESIDENTIAL': 'Apartment',
  'INDEPENDENT_HOUSE': 'Villa',
  'OFFICE': 'Commercial',
  'SHOP': 'Commercial',
  'WAREHOUSE': 'Commercial',
  'OTHER': 'Commercial',
};

const propertyStatusMap: Record<string, Property['status']> = {
  'PENDING_REVIEW': 'Draft',
  'ACTIVE': 'Listed',
  'VERIFICATION_REQUESTED': 'Verification In Progress',
  'VERIFICATION_IN_PROGRESS': 'Verification In Progress',
  'VERIFICATION_COMPLETED': 'Listed',
  'PURCHASE_PROCESSING': 'Verification In Progress',
  'SOLD': 'Sold',
  'INACTIVE': 'Draft',
};

const verificationStatusMap: Record<string, VerificationRequest['status']> = {
  'REQUESTED': 'Submitted',
  'ASSIGNED': 'Assigned',
  'VERIFICATION_IN_PROGRESS': 'Verification In Progress',
  'LAWYER_VERIFICATION': 'Verification In Progress',
  'SITE_INSPECTION': 'Verification In Progress',
  'RM_REVIEW': 'Verification In Progress',
  'FINALIZED': 'Report Uploaded',
  'COMPLETED': 'Completed',
};

const maintenanceStatusMap: Record<string, MaintenanceRequest['status']> = {
  'REQUESTED': 'Requested',
  'ASSIGNED': 'Active',
  'ACTIVE': 'Active',
  'INSPECTION_SCHEDULED': 'Active',
  'INSPECTION_COMPLETED': 'Monthly Inspection Completed',
  'ISSUE_REPORTED': 'Issue Reported',
  'RESOLVED': 'Completed',
  'COMPLETED': 'Completed',
};

const leaseStatusMap: Record<string, LeaseRequest['status']> = {
  'REQUESTED': 'Requested',
  'AGREEMENT_PENDING': 'Agreement Pending',
  'ACTIVE': 'Active',
  'RENEWAL_DUE': 'Renewal Due',
  'RENEWED': 'Renewed',
  'CLOSED': 'Closed',
};

export function mapBackendProperty(p: any): Property {
  return {
    id: p.id,
    title: p.title || '',
    type: propertyTypeMap[p.type] || 'Apartment',
    price: Number(p.price) || 0,
    currency: 'INR',
    address: p.address || '',
    city: '', // Backend doesn't have separate city field
    state: '',
    pincode: '',
    googleMapUrl: p.coordinates || '',
    description: p.description || '',
    images: (p.images || []).map((img: any) => typeof img === 'string' ? img : img.url),
    videos: (p.videos || []).map((vid: any) => typeof vid === 'string' ? vid : vid.url),
    plotAreaSqFt: Number(p.area) || 0,
    builtUpAreaSqFt: Number(p.area) || 0,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    amenities: [],
    ownerDetails: {
      name: p.owner?.firstName ? `${p.owner.firstName} ${p.owner.lastName}` : '',
      contact: p.owner?.phone || '',
      email: p.owner?.email || '',
    },
    agentId: p.agentId || '',
    agentName: p.agent?.firstName ? `${p.agent.firstName} ${p.agent.lastName}` : '',
    status: propertyStatusMap[p.status] || 'Draft',
    createdAt: p.createdAt || new Date().toISOString(),
  };
}

export function mapBackendVerification(v: any): VerificationRequest {
  return {
    id: v.id,
    propertyId: v.propertyId,
    propertyTitle: v.property?.title || '',
    propertyAddress: v.property?.address || '',
    propertyImage: v.property?.images?.[0]?.url || '',
    isExternal: v.property?.source === 'EXTERNAL_PROPERTY',
    nriId: v.requestedById || '',
    nriName: '',
    nriEmail: '',
    assignedRmId: v.rmId || '',
    assignedRmName: '',
    status: verificationStatusMap[v.status] || 'Submitted',
    recommendation: undefined,
    verificationReportPdf: undefined,
    rmImages: [],
    rmComments: v.checklists?.[0]?.items?.map((i: any) => i.rmComment).filter(Boolean).join('; ') || undefined,
    dateSubmitted: v.createdAt || new Date().toISOString(),
    dateUpdated: v.updatedAt || new Date().toISOString(),
  };
}

export function mapBackendMaintenance(m: any): MaintenanceRequest {
  return {
    id: m.id,
    propertyId: m.propertyId,
    propertyTitle: m.property?.title || '',
    propertyAddress: m.property?.address || '',
    propertyImage: m.property?.images?.[0]?.url || '',
    nriId: m.nriId || '',
    nriName: '',
    requirements: m.description || '',
    assignedRmId: m.assignedRMId || '',
    assignedRmName: '',
    status: maintenanceStatusMap[m.status] || 'Requested',
    monthlyInspections: [],
    emergencyInspections: [],
    createdAt: m.createdAt || new Date().toISOString(),
  };
}

export function mapBackendLease(l: any): LeaseRequest {
  return {
    id: l.id,
    propertyId: l.propertyId,
    propertyTitle: l.property?.title || '',
    propertyAddress: l.property?.address || '',
    propertyImage: l.property?.images?.[0]?.url || '',
    nriId: l.nriId || '',
    nriName: '',
    leaseDurationMonths: 12,
    expectedMonthlyRent: Number(l.expectedRent) || 0,
    specialConditions: l.specialConditions || '',
    occupancyType: 'Long Term Rental',
    assignedRmId: '',
    assignedRmName: '',
    agreementCopyPdf: undefined,
    status: leaseStatusMap[l.status] || 'Requested',
    monthlyRentPayouts: (l.payments || []).map((p: any) => ({
      id: p.id,
      month: new Date(p.date).toLocaleString('default', { month: 'long', year: 'numeric' }),
      amount: Number(p.amount),
      status: 'Paid' as const,
      payoutDate: p.date,
    })),
    createdAt: l.startDate || new Date().toISOString(),
  };
}

import { VerificationCheckpoint } from '@/types';

export const DEFAULT_CHECKPOINTS: Omit<VerificationCheckpoint, 'id'>[] = [
  // Legal Checkpoints (→ Lawyer)
  {
    category: 'legal',
    name: 'Title Deed Verification',
    description: 'Verify ownership history, chain of title, and clear title status',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },
  {
    category: 'legal',
    name: 'Encumbrance Certificate Check',
    description: 'Confirm no mortgages, liens, or legal disputes on the property',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },
  {
    category: 'legal',
    name: 'Land Use & Zoning Compliance',
    description: 'Verify DTCP/CMDA approvals, zoning rules, and land-use classification',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },
  {
    category: 'legal',
    name: 'Litigation & Dispute Check',
    description: 'Search court records for pending or past litigation involving the property',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },
  {
    category: 'legal',
    name: 'Power of Attorney Verification',
    description: 'If applicable, validate PoA documents for NRI transactions',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },
  {
    category: 'legal',
    name: 'Sale Agreement Review',
    description: 'Draft review and legal opinion on the sale/purchase agreement',
    assignedTo: 'lawyer',
    status: 'pending',
    selected: true,
  },

  // Financial Checkpoints (→ Chartered Accountant)
  {
    category: 'financial',
    name: 'Property Valuation Assessment',
    description: 'Independent fair market value assessment and comparison',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
  {
    category: 'financial',
    name: 'Tax Compliance Check',
    description: 'Verify property tax payments, arrears, and municipal dues',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
  {
    category: 'financial',
    name: 'TDS & Capital Gains Advisory',
    description: 'Calculate TDS obligations and capital gains tax implications for NRI',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
  {
    category: 'financial',
    name: 'FEMA Compliance Review',
    description: 'Verify compliance with Foreign Exchange Management Act for NRI buyers',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
  {
    category: 'financial',
    name: 'Stamp Duty & Registration Cost Estimate',
    description: 'Provide stamp duty calculation and registration cost breakdown',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
  {
    category: 'financial',
    name: 'Rental Income Tax Planning',
    description: 'If buying for lease, provide tax-optimized rental income structure',
    assignedTo: 'ca',
    status: 'pending',
    selected: true,
  },
];

export function createDefaultCheckpoints(): VerificationCheckpoint[] {
  return DEFAULT_CHECKPOINTS.map((cp, idx) => ({
    ...cp,
    id: `cp-${Date.now()}-${idx}`,
  }));
}

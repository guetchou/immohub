export type DocumentType =
  | "REGISTRATION_CERTIFICATE"
  | "TAX_CLEARANCE"
  | "FIRE_SAFETY"
  | "HEALTH_PERMIT"
  | "CLASSIFICATION_CERTIFICATE"
  | "INSURANCE"
  | "LEASE_AGREEMENT"
  | "FLOOR_PLAN"
  | "INSPECTION_REPORT";

export type DocumentStatus =
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VALIDATED"
  | "REJECTED"
  | "EXPIRED";

export interface ComplianceDocument {
  id: string;
  propertyId: string;
  propertyName: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  fileUrl?: string;
  submittedAt?: string;
  validatedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
  reviewedById?: string;
  reviewedByName?: string;
}

export interface ComplianceChecklist {
  propertyId: string;
  propertyName: string;
  documents: ComplianceDocument[];
  overallStatus: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT";
  completionRate: number;
  lastUpdatedAt: string;
}

export type MinistryDossierStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "DOCUMENTS_REQUESTED"
  | "INSPECTION_SCHEDULED"
  | "INSPECTED"
  | "NOTICE_SENT"
  | "REGULARIZED"
  | "TRANSMITTED"
  | "CLOSED"
  | "SUSPENDED";

export interface MinistryCase {
  id: string;
  referenceNumber: string;
  propertyId: string;
  propertyName: string;
  operatorName: string;
  district: string;
  status: MinistryDossierStatus;
  openedAt: string;
  updatedAt: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  notes?: string;
  taxRiskScore?: number;
}

export interface Inspection {
  id: string;
  caseId: string;
  propertyId: string;
  propertyName: string;
  scheduledDate: string;
  conductedDate?: string;
  inspectorId: string;
  inspectorName: string;
  status: "SCHEDULED" | "CONDUCTED" | "CANCELLED" | "PENDING_REPORT";
  findings?: InspectionFinding[];
  reportUrl?: string;
}

export interface InspectionFinding {
  id: string;
  inspectionId: string;
  category: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requiresAction: boolean;
  resolvedAt?: string;
}

export interface TaxRiskAssessment {
  propertyId: string;
  propertyName: string;
  district: string;
  estimatedNights: number;
  estimatedRevenue: number;
  declaredRevenue: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  lastAssessedAt: string;
}

export interface MonthlyTourismDeclaration {
  id: string;
  propertyId: string;
  propertyName: string;
  month: string;
  year: number;
  totalNights: number;
  totalRevenue: number;
  foreignGuests: number;
  localGuests: number;
  submittedAt?: string;
  validatedAt?: string;
  status: "PENDING" | "SUBMITTED" | "VALIDATED" | "REJECTED";
}

export interface AdministrativeNotification {
  id: string;
  type: "MISSING_DECLARATION" | "INSPECTION_ALERT" | "COMPLIANCE_ISSUE" | "TAX_RISK" | "DEADLINE";
  propertyId: string;
  propertyName: string;
  message: string;
  severity: "INFO" | "WARNING" | "URGENT";
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
}

export interface MinistryStats {
  totalFurnishedProperties: number;
  declaredProperties: number;
  undeclaredProperties: number;
  pendingInspections: number;
  openCases: number;
  criticalRiskProperties: number;
  complianceRate: number;
  monthlyRevenueEstimate: number;
}

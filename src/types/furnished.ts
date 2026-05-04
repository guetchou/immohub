export type ComplianceStatus =
  | "UNDECLARED"
  | "PENDING_DOCUMENTS"
  | "DECLARED"
  | "AUTHORIZED"
  | "CLASSIFIED"
  | "NON_COMPLIANT"
  | "SUSPENDED";

export interface FurnishedProperty {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  operatorId: string;
  operatorName: string;
  totalUnits: number;
  activeUnits: number;
  pricePerNight: number;
  complianceStatus: ComplianceStatus;
  classificationLevel?: string;
  declaredAt?: string;
  lastInspectionDate?: string;
  taxRiskScore?: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FurnishedUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor?: number;
  surface: number;
  maxOccupancy: number;
  pricePerNight: number;
  amenities: string[];
  isAvailable: boolean;
  currentOccupancy: number;
}

export interface FurnishedBooking {
  id: string;
  unitId: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  isDeclared: boolean;
  createdAt: string;
}

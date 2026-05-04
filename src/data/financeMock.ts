export interface FinanceTransmission {
  id: string;
  propertyName: string;
  operatorName: string;
  nimt: string | null;
  year: number;
  totalNights: number;
  totalRevenue: number;
  taxAmount: number;
  status: "PENDING" | "RECEIVED" | "IN_REVIEW" | "PROCESSED";
  transmittedAt: string;
  processedAt: string | null;
}

export const financeTransmissionsMock: FinanceTransmission[] = [
  {
    id: "ft-001",
    propertyName: "Résidence Les Palmiers",
    operatorName: "SARL Palmiers Immobilier",
    nimt: "CG-BZV-MT-2024-000001",
    year: 2025,
    totalNights: 2520,
    totalRevenue: 88200000,
    taxAmount: 8820000,
    status: "RECEIVED",
    transmittedAt: "2025-04-01T08:00:00Z",
    processedAt: "2025-04-15T10:00:00Z",
  },
  {
    id: "ft-002",
    propertyName: "Villa Congo Business",
    operatorName: "Congo Business Hospitality",
    nimt: "CG-BZV-MT-2022-000002",
    year: 2025,
    totalNights: 4680,
    totalRevenue: 257400000,
    taxAmount: 25740000,
    status: "IN_REVIEW",
    transmittedAt: "2025-04-03T09:00:00Z",
    processedAt: null,
  },
  {
    id: "ft-003",
    propertyName: "Résidence Makélékélé Premium",
    operatorName: "Groupe AFRICA STAY",
    nimt: "CG-BZV-MT-2023-000003",
    year: 2025,
    totalNights: 2160,
    totalRevenue: 97200000,
    taxAmount: 9720000,
    status: "PENDING",
    transmittedAt: "2025-04-10T08:00:00Z",
    processedAt: null,
  },
];

export const financeDashboardMock = {
  totalRegisteredProperties: 6,
  propertiesWithNimt: 4,
  totalTransmissions: 3,
  pendingTransmissions: 1,
  totalRevenueDeclared: 442800000,
  criticalRiskCount: 2,
  totalTaxAmount: 44280000,
};

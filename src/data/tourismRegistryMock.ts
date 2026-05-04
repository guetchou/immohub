export interface TourismRegistryEntry {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  operatorName: string;
  nimt: string | null;
  complianceStatus: string;
  classificationLevel: string | null;
  totalUnits: number;
  pricePerNight: number;
  taxRiskScore: number;
  declaredAt: string | null;
  lastInspectionDate: string | null;
  createdAt: string;
}

export const tourismRegistryMock: TourismRegistryEntry[] = [
  {
    id: "fp-001",
    name: "Résidence Les Palmiers",
    address: "Avenue de l'Indépendance, n°42",
    district: "Bacongo",
    city: "Brazzaville",
    operatorName: "SARL Palmiers Immobilier",
    nimt: "CG-BZV-MT-2024-000001",
    complianceStatus: "AUTHORIZED",
    classificationLevel: "3 étoiles",
    totalUnits: 12,
    pricePerNight: 35000,
    taxRiskScore: 25,
    declaredAt: "2023-06-15",
    lastInspectionDate: "2024-11-20",
    createdAt: "2023-01-10T08:00:00Z",
  },
  {
    id: "fp-002",
    name: "Appartements Moungali",
    address: "Rue Bouenza, n°15",
    district: "Moungali",
    city: "Brazzaville",
    operatorName: "Pierre NZAMBA",
    nimt: null,
    complianceStatus: "UNDECLARED",
    classificationLevel: null,
    totalUnits: 6,
    pricePerNight: 22000,
    taxRiskScore: 82,
    declaredAt: null,
    lastInspectionDate: null,
    createdAt: "2022-08-01T08:00:00Z",
  },
  {
    id: "fp-003",
    name: "Villa Congo Business",
    address: "Boulevard Denis Sassou Nguesso, n°88",
    district: "Poto-Poto",
    city: "Brazzaville",
    operatorName: "Congo Business Hospitality",
    nimt: "CG-BZV-MT-2022-000002",
    complianceStatus: "CLASSIFIED",
    classificationLevel: "4 étoiles",
    totalUnits: 20,
    pricePerNight: 55000,
    taxRiskScore: 15,
    declaredAt: "2022-03-01",
    lastInspectionDate: "2025-01-10",
    createdAt: "2021-11-15T08:00:00Z",
  },
  {
    id: "fp-004",
    name: "Studio Centre-Ville",
    address: "Rue de la Paix, n°5",
    district: "Centre-Ville",
    city: "Brazzaville",
    operatorName: "Marie IBARA",
    nimt: null,
    complianceStatus: "PENDING_DOCUMENTS",
    classificationLevel: null,
    totalUnits: 3,
    pricePerNight: 18000,
    taxRiskScore: 55,
    declaredAt: null,
    lastInspectionDate: null,
    createdAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "fp-005",
    name: "Résidence Makélékélé Premium",
    address: "Avenue Matsoua, n°120",
    district: "Makélékélé",
    city: "Brazzaville",
    operatorName: "Groupe AFRICA STAY",
    nimt: "CG-BZV-MT-2023-000003",
    complianceStatus: "NON_COMPLIANT",
    classificationLevel: null,
    totalUnits: 15,
    pricePerNight: 45000,
    taxRiskScore: 78,
    declaredAt: "2023-01-10",
    lastInspectionDate: null,
    createdAt: "2022-06-01T08:00:00Z",
  },
  {
    id: "fp-006",
    name: "Suites Talangaï",
    address: "Rue des Plateaux, n°33",
    district: "Talangaï",
    city: "Brazzaville",
    operatorName: "SARL TALANGAI HOSPITALITY",
    nimt: "CG-BZV-MT-2024-000004",
    complianceStatus: "DECLARED",
    classificationLevel: null,
    totalUnits: 8,
    pricePerNight: 28000,
    taxRiskScore: 40,
    declaredAt: "2024-02-14",
    lastInspectionDate: null,
    createdAt: "2023-09-01T08:00:00Z",
  },
];

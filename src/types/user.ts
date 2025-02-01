export type UserRole = 
  | "USER"
  | "TENANT" // locataire
  | "LANDLORD" // propriétaire
  | "AGENCY" // agence immobilière
  | "BROKER" // démarcheur/courtier
  | "CANVASSER" // démarcheur
  | "LAND_OWNER" // propriétaire terrain
  | "INSURANCE" // assurance
  | "NOTARY" // notaire
  | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  full_name?: string;
  phone?: string;
  company_name?: string;
  website?: string;
}
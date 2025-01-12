export type UserRole = 
  | "USER"
  | "TENANT" // locataire
  | "OWNER" // propriétaire
  | "AGENCY" // agence immobilière
  | "BROKER" // démarcheur/courtier
  | "LAND_OWNER" // propriétaire terrain
  | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
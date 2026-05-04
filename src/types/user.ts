export type UserRole =
  | "USER"
  | "TENANT"
  | "LANDLORD"
  | "AGENCY"
  | "BROKER"
  | "CANVASSER"
  | "LAND_OWNER"
  | "INSURANCE"
  | "NOTARY"
  | "ADMIN"
  | "FURNISHED_OPERATOR"
  | "MINISTRY_ADMIN"
  | "MINISTRY_VIEWER"
  | "MINISTRY_INSPECTOR"
  | "COMPLIANCE_AGENT"
  | "TAX_ANALYST";

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
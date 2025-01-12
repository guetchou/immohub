export type VisitType = "physical" | "virtual";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface AppointmentFormData {
  type: VisitType;
  date: Date | undefined;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}

export interface Appointment extends AppointmentFormData {
  id: string;
  propertyId: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
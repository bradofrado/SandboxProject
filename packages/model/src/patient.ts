export interface PatientListItem {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfLoss: Date;
  statuses: string[];
  incidentType: string;
  email: string;
  phone: string;
  notes: string;
  lawFirm: string;
  primaryContact: string;
  lastUpdateDate: Date | null;
  outstandingBalance: number;
}

export interface Patient extends PatientListItem {
	status: PatientStatus,
	charges: PatientFinanceProvider[]
}

export interface PatientStatus {
  patientId: string;
  appointments: Appointment[];
  status: PatientStatusType;
}

export const patientStatuses = [
  "File Setup",
  "Treatment",
  "Demand",
  "Negotiation",
  "Settlement",
] as const;
export type PatientStatusType = (typeof patientStatuses)[number];

export interface Appointment {
  date: Date;
  note: string;
}

export interface PatientDocument {
  patientId: string;
  name: string;
  path: string;
  lastUpdate: Date;
  size: number;
  type: "pdf" | "img" | "folder";
}

export interface PatientFinanceProvider {
  patientId: string;
  name: string;
  status: PatientFinanceStatus;
  amount: number;
}
export type PatientFinanceStatus = "Paid" | "Unpaid";

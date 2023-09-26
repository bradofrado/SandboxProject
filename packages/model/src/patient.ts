export interface Patient {
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
  appointments: Date[];
  lawFirm: string;
  primaryContact: string;
  lastUpdateDate: Date | null;
  outstandingBalance: number;
}

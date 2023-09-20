export interface Patient {
  name: string;
  id: string;
  dateOfBirth: Date;
  dateOfLoss: Date;
  status: string;
  notes: string;
  appointments: Date[];
}

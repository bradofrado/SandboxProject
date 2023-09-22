export interface Patient {
  firstName: string,
  lastName: string,
  id: string;
  dateOfBirth: Date;
  dateOfLoss: Date;
  status: string;
  notes: string;
  appointments: Date[];
}

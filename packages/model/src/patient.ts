export interface Patient {
	id: string;
  	firstName: string,
  	lastName: string,
  	dateOfBirth: Date;
  	dateOfLoss: Date;
  	statuses: string[];
  	notes: string;
  	appointments: Date[];
	lawFirm: string,
	primaryContact: string,
	lastUpdateDate: Date | null,
	outstandingBalance: number
}

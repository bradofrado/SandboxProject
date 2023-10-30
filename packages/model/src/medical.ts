import { PatientBase } from "./patient";

export interface MedicalPatient extends PatientBase {
	lawFirm: string;
}

export interface MedicalCharge {
	providerName: string;
	amount: number;
	status: 'Paid' | 'Unpaid'
}
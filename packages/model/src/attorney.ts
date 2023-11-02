import { PatientBase, PatientStatusType } from "./patient";

export interface AttorneyClient extends PatientBase {
	dateOfLoss: Date,
	incidentType: string,
	lawFirm: string;
	medicalProvider: string;
	primaryContact: string;
	status: PatientStatusType | undefined;
	lastUpdateDate: Date | undefined;
	limit: number
}
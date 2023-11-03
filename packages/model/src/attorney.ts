import { IncidentType, PatientBase, PatientStatusType } from "./patient";

export interface AttorneyClient extends PatientBase {
	dateOfLoss: Date,
	incidentType: IncidentType,
	lawFirm: string;
	medicalProvider: string;
	primaryContact: string;
	status: PatientStatusType | undefined;
	lastUpdateDate: Date | undefined;
	policyLimit: number
}
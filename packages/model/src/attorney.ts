import { PatientBase, PatientStatusType } from "./patient";

export interface AttorneyClient extends PatientBase {
	lawFirm: string;
	primaryContact: string;
	status: PatientStatusType | undefined;
	lastUpdateDate: Date | undefined;
	limit: number
}
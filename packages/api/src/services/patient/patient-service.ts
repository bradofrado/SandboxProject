import type { Patient } from "model/src/patient";
import type { AttorneyClient } from "model/src/attorney";
import type { MedicalPatient } from "model/src/medical";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import { AttorneyService } from "../attorney/attorney-service";
import { MedicalService } from "../medical/medical-service";

export interface PatientService {
	getPatient: (firmId: string, patientId: string) => Promise<Patient | undefined>
	getPatients: (firmId: string) => Promise<Patient[]>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace PatientService {
	export const $: interfaces.ServiceIdentifier<PatientService> = Symbol('PatientService');
}

interface PatientLinking {
	medicalId: string;
	attorneyId: string;
	patientMedicalId: string;
	patientAttorneyId: string
}

/**
 * 1. Get medical patients
 * 2. Get the law firm... do we have an account for this law firm?
 * 3. If no, then just return the data that we can
 * 4. If yes, then check our linking table to see if we have an entry for this patient
 * 5. If we have an entry, then use that table to get the client from the attorney api
 * 6. If we don't, then create an entry by looping through the list of clients and 
 * 		matching up on common data
 */
@injectable()
export class TestPatientService implements PatientService {
	constructor(@inject(MedicalService.$) private medicalService: MedicalService, @inject(AttorneyService.$) private attorneyService: AttorneyService) {}
	public async getPatients(firmId: string): Promise<Patient[]> {
		const patients = await this.medicalService.getPatients(firmId);

		return Promise.all(patients.map(async (patient) => this.getPatientFromMedical(patient, firmId)))
	}

	public async getPatient(firmId: string, patientId: string): Promise<Patient | undefined>{
		const patient = await this.medicalService.getPatient(firmId, patientId);

		return patient ? this.getPatientFromMedical(patient, firmId) : undefined;
	}

	private async getPatientFromMedical(patient: MedicalPatient, medicalId: string): Promise<Patient> {
		const firmId = this.getIdForFirm(patient.lawFirm);
		if (firmId === undefined) {
			const outstandingBalance = await this.getOustandingBalance(medicalId, patient.id);
			return {
				...patient,
				primaryContact: '',
				lastUpdateDate: undefined,
				notes: '',
				outstandingBalance,
				status: undefined
			};
		}
	
		let linking = this.getLinking('Spinal Rehab', patient.id);
		if (linking === undefined) {
			linking = this.createLinking(medicalId, patient.id, firmId);
		}
	
		const client = await this.getClientFromLinking(linking);
		if (client === undefined) {
			throw new Error("There was an error finding the client");
		}
	
		return this.getPatientFromMedicalAndClient(medicalId, patient, client);
	}

	private async getPatientFromMedicalAndClient(firmId: string, medicalPatient: MedicalPatient, attorneyClient: AttorneyClient): Promise<Patient> {
		const outstandingBalance = await this.getOustandingBalance(firmId, medicalPatient.id);

		return {
			...medicalPatient,
			...attorneyClient,
			notes: '',
			outstandingBalance
		}
	}

	private async getOustandingBalance(firmId: string, medicalId: string): Promise<number> {
		const charges = await this.medicalService.getCharges(firmId, medicalId);
		const balance = charges.reduce((prev, curr) => prev + (curr.status === 'Unpaid' ? curr.amount : 0), 0);

		return balance;
	}

	private async getClientFromLinking(linking: PatientLinking): Promise<AttorneyClient | undefined> {
		return this.attorneyService.getClient(linking.attorneyId, linking.patientAttorneyId);
	}

	private createLinking(mid: string, patientId: string, aid: string): PatientLinking {
		return {
			medicalId: mid,
			attorneyId: aid,
			patientMedicalId: patientId,
			patientAttorneyId: patientId
		}
	}

	private getIdForFirm(firmName: string): string | undefined {
		return firmName === 'Siegfried and Jensen' ? '123' : undefined;
	}
	
	private getLinking(id: string, patientId: string): PatientLinking | undefined {
		return {
			medicalId: id,
			patientMedicalId: patientId,
			attorneyId: '123',
			patientAttorneyId: patientId
		}
	}
}
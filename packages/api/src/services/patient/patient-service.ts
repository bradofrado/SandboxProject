import type { Patient, PatientBase } from "model/src/patient";
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
	medicalId: string; //Medical provider's account id
	attorneyId: string; //Attorney's account id
	patientMedicalId: string; //Patient id in medical provider's api system
	patientAttorneyId: string //Client id in attorney's api system
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

		const client = await this.getClientFromMedicalPatient(medicalId, firmId, patient);
		
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

	private async getClientFromMedicalPatient(medicalId: string, firmId: string, patient: MedicalPatient): Promise<AttorneyClient | undefined> {
		//See if there is a linking for this medical patient
		const linking = this.getLinking(medicalId, patient.id);
		
		//If there is not, then find the matching client and create a linking
		if (linking === undefined) {
			const client = await this.findMatchingClientFromMedicalPatient(firmId, patient);
			if (client === undefined) {
				throw new Error(`There are no matching clients for ${patient.id}`);
			}
			this.createLinking(medicalId, patient.id, firmId, client.id);

			return client;
		}
	
		return this.getClientFromLinking(linking);
	}

	private async findMatchingClientFromMedicalPatient(firmId: string, patient: MedicalPatient): Promise<AttorneyClient | undefined> {
		//Matches when a set of properties are true for both parties.
		// TODO: Will definately have to update this function because of bad data
		const isMatch = (_client: AttorneyClient, _patient: MedicalPatient): boolean => {
			const keys: (keyof PatientBase)[] = ['firstName', 'lastName', 'dateOfBirth', 'dateOfLoss'];

			const count = keys.reduce((prev, curr) => prev + (_client[curr] === _patient[curr] ? 1 : 0), 0);

			return count === keys.length;
		}
		
		const clients = await this.attorneyService.getClients(firmId);

		return clients.find(client => isMatch(client, patient));
	}

	private async getClientFromLinking(linking: PatientLinking): Promise<AttorneyClient | undefined> {
		return this.attorneyService.getClient(linking.attorneyId, linking.patientAttorneyId);
	}

	private createLinking(mid: string, patientId: string, aid: string, clientId: string): PatientLinking {
		//TODO: Create an entry in the Linking table that represents a linking between a 
		//      medical patient and an attorney client
		return {
			medicalId: mid,
			attorneyId: aid,
			patientMedicalId: patientId,
			patientAttorneyId: clientId
		}
	}

	private getIdForFirm(firmName: string): string | undefined {
		//TODO: look in database in Attorney table and see if we have an account for this law firm
		//      and return its id
		return firmName === 'Siegfried and Jensen' ? '123' : undefined;
	}
	
	private getLinking(id: string, patientId: string): PatientLinking | undefined {
		//TODO: Look in the Linking table for an entry for this given medical patient.
		//      if there is then return that linking, otherwise return undefined
		//      meaning there is not currently a link for this patient
		return {
			medicalId: id,
			patientMedicalId: patientId,
			attorneyId: '123',
			patientAttorneyId: patientId
		}
	}
}
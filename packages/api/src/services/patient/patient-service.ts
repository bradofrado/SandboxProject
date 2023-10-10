import type { Patient, PatientBase } from "model/src/patient";
import type { AttorneyClient } from "model/src/attorney";
import type { MedicalPatient } from "model/src/medical";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { AttorneyService } from "../attorney/attorney-service";
import { MedicalService } from "../medical/medical-service";
import type { PatientLinking} from "../../repository/patient-linking";
import { PatientLinkingRepository } from "../../repository/patient-linking";
import type { ProviderAccount} from "../../repository/provider-account";
import { ProviderAccountRepository } from "../../repository/provider-account";
import { AttorneyRegistry } from "../attorney/attorney-registry";

export interface PatientService {
	getPatient: (firmId: string, patientId: string) => Promise<Patient | undefined>
	getPatients: (firmId: string) => Promise<Patient[]>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace PatientService {
	export const $: interfaces.ServiceIdentifier<PatientService> = Symbol('PatientService');
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
	constructor(@inject(MedicalService.$) private medicalService: MedicalService, 
		@inject(AttorneyRegistry.$) private attorneyRegistry: AttorneyRegistry, @inject(PatientLinkingRepository.$) private patientLinkingRepository: PatientLinkingRepository,
		@inject(ProviderAccountRepository.$) private providerAccountRepository: ProviderAccountRepository) {}
	public async getPatients(firmId: string): Promise<Patient[]> {
		const patients = await this.medicalService.getPatients(firmId);

		return Promise.all(patients.map(async (patient) => this.getPatientFromMedical(patient, firmId)))
	}

	public async getPatient(firmId: string, patientId: string): Promise<Patient | undefined>{
		const patient = await this.medicalService.getPatient(firmId, patientId);

		return patient ? this.getPatientFromMedical(patient, firmId) : undefined;
	}

	private async getPatientFromMedical(patient: MedicalPatient, medicalId: string): Promise<Patient> {
		const firm = await this.getFirmProvider(patient.lawFirm);
		if (firm === undefined) {
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

		const client = await this.getClientFromMedicalPatient(medicalId, firm, patient);
		
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

	private async getClientFromMedicalPatient(medicalId: string, firm: ProviderAccount, patient: MedicalPatient): Promise<AttorneyClient | undefined> {
		//See if there is a linking for this medical patient
		const linking = await this.getLinking(medicalId, patient.id);
		const attorneyService = this.attorneyRegistry.getService(firm.name);

		//If there is not, then find the matching client and create a linking
		if (linking === undefined) {
			const client = await this.findMatchingClientFromMedicalPatient(firm.name, patient, attorneyService);
			if (client === undefined) {
				throw new Error(`There are no matching clients for patient ${patient.id} and firm ${firm.name}`);
			}
			await this.createLinking(medicalId, patient.id, firm.id, client.id);

			return client;
		}
	
		return this.getClientFromLinking(linking, attorneyService);
	}

	private async findMatchingClientFromMedicalPatient(firmId: string, patient: MedicalPatient, attorneyService: AttorneyService): Promise<AttorneyClient | undefined> {
		//Matches when a set of properties are true for both parties.
		// TODO: Will definately have to update this function because of bad data
		const isMatch = (_client: AttorneyClient, _patient: MedicalPatient): boolean => {
			const keys: (keyof PatientBase)[] = ['firstName', 'lastName'];

			const count = keys.reduce((prev, curr) => prev + (_client[curr] === _patient[curr] ? 1 : 0), 0);

			return count === keys.length;
		}
		
		const clients = await attorneyService.getClients(firmId);

		return clients.find(client => isMatch(client, patient));
	}

	private async getClientFromLinking(linking: PatientLinking, attorneyService: AttorneyService): Promise<AttorneyClient | undefined> {
		return attorneyService.getClient(linking.attorneyId, linking.attorneyPatientId);
	}

	private async createLinking(mid: string, patientId: string, aid: string, clientId: string): Promise<PatientLinking> {
		const newLinking = await this.patientLinkingRepository.createLinking({
			medicalId: mid,
			attorneyId: aid,
			medicalPatientId: patientId,
			attorneyPatientId: clientId
		})
		
		return newLinking;
	}

	private async getFirmProvider(firmName: string): Promise<ProviderAccount | undefined> {
		const provider = await this.providerAccountRepository.getAccount(firmName);
		
		return provider;
	}
	
	private async getLinking(id: string, patientId: string): Promise<PatientLinking | undefined> {
		const linking = await this.patientLinkingRepository.getLinking(id, patientId);
		
		return linking;
	}
}
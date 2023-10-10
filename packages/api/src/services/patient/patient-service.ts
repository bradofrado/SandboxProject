import type { Patient, PatientBase, ProviderAccount } from "model/src/patient";
import type { AttorneyClient } from "model/src/attorney";
import type { MedicalPatient } from "model/src/medical";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { AttorneyService } from "../attorney/attorney-service";
import type { MedicalService } from "../medical/medical-service";
import type { PatientLinking} from "../../repository/patient-linking";
import { PatientLinkingRepository } from "../../repository/patient-linking";
import { ProviderAccountRepository } from "../../repository/provider-account";
import { AttorneyRegistry } from "../attorney/attorney-registry";
import { MedicalRegistry } from "../medical/medical-registry";
import 'reflect-metadata';

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
	constructor(@inject(MedicalRegistry.$) private medicalRegistry: MedicalRegistry, 
		@inject(AttorneyRegistry.$) private attorneyRegistry: AttorneyRegistry, @inject(PatientLinkingRepository.$) private patientLinkingRepository: PatientLinkingRepository,
		@inject(ProviderAccountRepository.$) private providerAccountRepository: ProviderAccountRepository) {}
	public async getPatients(firmId: string): Promise<Patient[]> {
		const medicalService = await this.getMedicalService(firmId);
		const patients = await medicalService.getPatients(firmId);

		return Promise.all(patients.map(async (patient) => this.getPatientFromMedical(patient, firmId, medicalService)))
	}

	public async getPatient(firmId: string, patientId: string): Promise<Patient | undefined>{
		const medicalService = await this.getMedicalService(firmId);
		const patient = await medicalService.getPatient(firmId, patientId);

		return patient ? this.getPatientFromMedical(patient, firmId, medicalService) : undefined;
	}

	private async getMedicalService(medicalId: string): Promise<MedicalService> {
		const medicalProvider = await this.providerAccountRepository.getAccountById(medicalId);

		if (!medicalProvider) {
			throw new Error(`Cannot find provider with id ${medicalId}`);
		}

		const medicalService = this.medicalRegistry.getService(medicalProvider.integration);

		return medicalService;
	}

	private async getPatientFromMedical(patient: MedicalPatient, medicalId: string, medicalService: MedicalService): Promise<Patient> {
		const firm = await this.getFirmProvider(patient.lawFirm);
		const outstandingBalance = await this.getOustandingBalance(medicalId, patient.id, medicalService);

		if (firm === undefined) {
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
	
		return this.getPatientFromMedicalAndClient(medicalId, patient, client, outstandingBalance);
	}

	private getPatientFromMedicalAndClient(firmId: string, medicalPatient: MedicalPatient, attorneyClient: AttorneyClient, outstandingBalance: number): Patient {
		return {
			...medicalPatient,
			...attorneyClient,
			notes: '',
			outstandingBalance
		}
	}

	private async getOustandingBalance(firmId: string, medicalId: string, medicalService: MedicalService): Promise<number> {
		const charges = await medicalService.getCharges(firmId, medicalId);
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

// export class TestPatientAttorneyService implements PatientService {
// 	constructor(@inject(MedicalRegistry.$) private medicalRegistry: MedicalRegistry, 
// 		@inject(AttorneyRegistry.$) private attorneyRegistry: AttorneyRegistry, @inject(PatientLinkingRepository.$) private patientLinkingRepository: PatientLinkingRepository,
// 		@inject(ProviderAccountRepository.$) private providerAccountRepository: ProviderAccountRepository) {}
// 	public async getPatients(firmId: string): Promise<Patient[]> {
// 		const attorneyService = await this.getAttorneyService(firmId);
// 		const clients = await attorneyService.getClients(firmId);

// 		return Promise.all(clients.map(async (client) => this.getPatientFromClient(client, firmId, attorneyService)))
// 	}

// 	public async getPatient(firmId: string, patientId: string): Promise<Patient | undefined>{
// 		const attorneyService = await this.getAttorneyService(firmId);
// 		const client = await attorneyService.getClient(firmId, patientId);

// 		return client ? this.getPatientFromClient(client, firmId, attorneyService) : undefined;
// 	}

// 	private async getAttorneyService(attorneyId: string): Promise<AttorneyService> {
// 		const attorneyProvider = await this.providerAccountRepository.getAccountById(attorneyId);

// 		if (!attorneyProvider) {
// 			throw new Error(`Cannot find provider with id ${attorneyId}`);
// 		}

// 		const attorneyService = this.attorneyRegistry.getService(attorneyProvider.name);

// 		return attorneyService;
// 	}

// 	private async getPatientFromClient(patient: AttorneyClient, medicalId: string, medicalService: MedicalService): Promise<Patient> {
// 		const firm = await this.getFirmProvider(patient.lawFirm);
// 		const outstandingBalance = await this.getOustandingBalance(medicalId, patient.id, medicalService);

// 		if (firm === undefined) {
// 			return {
// 				...patient,
// 				primaryContact: '',
// 				lastUpdateDate: undefined,
// 				notes: '',
// 				outstandingBalance,
// 				status: undefined
// 			};
// 		}

// 		const client = await this.getClientFromMedicalPatient(medicalId, firm, patient);
		
// 		if (client === undefined) {
// 			throw new Error("There was an error finding the client");
// 		}
	
// 		return this.getPatientFromMedicalAndClient(medicalId, patient, client, outstandingBalance);
// 	}

// 	private getPatientFromMedicalAndClient(firmId: string, medicalPatient: MedicalPatient, attorneyClient: AttorneyClient, outstandingBalance: number): Patient {
// 		return {
// 			...medicalPatient,
// 			...attorneyClient,
// 			notes: '',
// 			outstandingBalance
// 		}
// 	}

// 	private async getOustandingBalance(firmId: string, medicalId: string, medicalService: MedicalService): Promise<number> {
// 		const charges = await medicalService.getCharges(firmId, medicalId);
// 		const balance = charges.reduce((prev, curr) => prev + (curr.status === 'Unpaid' ? curr.amount : 0), 0);

// 		return balance;
// 	}

// 	private async getClientFromMedicalPatient(medicalId: string, firm: ProviderAccount, patient: MedicalPatient): Promise<AttorneyClient | undefined> {
// 		//See if there is a linking for this medical patient
// 		const linking = await this.getLinking(medicalId, patient.id);
// 		const attorneyService = this.attorneyRegistry.getService(firm.name);

// 		//If there is not, then find the matching client and create a linking
// 		if (linking === undefined) {
// 			const client = await this.findMatchingClientFromMedicalPatient(firm.name, patient, attorneyService);
// 			if (client === undefined) {
// 				throw new Error(`There are no matching clients for patient ${patient.id} and firm ${firm.name}`);
// 			}
// 			await this.createLinking(medicalId, patient.id, firm.id, client.id);

// 			return client;
// 		}
	
// 		return this.getClientFromLinking(linking, attorneyService);
// 	}

// 	private async findMatchingClientFromMedicalPatient(firmId: string, patient: MedicalPatient, attorneyService: AttorneyService): Promise<AttorneyClient | undefined> {
// 		//Matches when a set of properties are true for both parties.
// 		// TODO: Will definately have to update this function because of bad data
// 		const isMatch = (_client: AttorneyClient, _patient: MedicalPatient): boolean => {
// 			const keys: (keyof PatientBase)[] = ['firstName', 'lastName'];

// 			const count = keys.reduce((prev, curr) => prev + (_client[curr] === _patient[curr] ? 1 : 0), 0);

// 			return count === keys.length;
// 		}
		
// 		const clients = await attorneyService.getClients(firmId);

// 		return clients.find(client => isMatch(client, patient));
// 	}

// 	private async getClientFromLinking(linking: PatientLinking, attorneyService: AttorneyService): Promise<AttorneyClient | undefined> {
// 		return attorneyService.getClient(linking.attorneyId, linking.attorneyPatientId);
// 	}

// 	private async createLinking(mid: string, patientId: string, aid: string, clientId: string): Promise<PatientLinking> {
// 		const newLinking = await this.patientLinkingRepository.createLinking({
// 			medicalId: mid,
// 			attorneyId: aid,
// 			medicalPatientId: patientId,
// 			attorneyPatientId: clientId
// 		})
		
// 		return newLinking;
// 	}

// 	private async getFirmProvider(firmName: string): Promise<ProviderAccount | undefined> {
// 		const provider = await this.providerAccountRepository.getAccount(firmName);
		
// 		return provider;
// 	}
	
// 	private async getLinking(id: string, patientId: string): Promise<PatientLinking | undefined> {
// 		const linking = await this.patientLinkingRepository.getLinking(id, patientId);
		
// 		return linking;
// 	}
// }
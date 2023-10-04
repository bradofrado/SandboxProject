import { injectable, interfaces } from "inversify";
import type { Patient } from "model/src/patient";

export interface AttorneyService {
	getPatients: (practiceName: string) => Promise<Patient[]>,
	getPatient: (patientId: string) => Promise<Patient>
}

@injectable()
export class TestAttorneyService implements AttorneyService {
	public getPatients(practiceName: string): Promise<Patient[]> {
		
	}

	public getPatient(patientId: string): Promise<Patient> {

	}

}

export namespace AttorneyService {
	export const $: interfaces.ServiceIdentifier<AttorneyService> = Symbol('AttorneyService');
}
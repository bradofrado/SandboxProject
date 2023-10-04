import type { Patient } from "model/src/patient";

export interface AttorneyService {
	getPatients: (practiceName: string) => Promise<Patient[]>,
	getPatient: (patientId: string) => Promise<Patient>
}

export class TestAttorneyService implements AttorneyService {
	public getPatients(practiceName: string): Promise<Patient[]> {
		
	}

	public getPatient(patientId: string): Promise<Patient> {

	}

}
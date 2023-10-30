/* eslint-disable @typescript-eslint/no-namespace -- allow*/
import type { interfaces } from "inversify";
import { injectable } from "inversify";
import type { PatientFeed } from "model/src/patient";

export interface PatientFeedRepository {
	getFeedsForPatient: (patientId: string) => Promise<PatientFeed[]>
	createFeedForPatient: (patientFeed: PatientFeed) => Promise<PatientFeed>
}

@injectable()
export class TestPatientFeedRepository implements PatientFeedRepository {
	public getFeedsForPatient(patientId: string): Promise<PatientFeed[]> {
		const patientStatus = patientStatuses.filter(status => status.patientId === patientId);
		return Promise.resolve(patientStatus);
	}

	public createFeedForPatient(patientFeed: PatientFeed): Promise<PatientFeed> {
		patientFeed.id = randUID();
		patientStatuses.push(patientFeed);

		return Promise.resolve(patientFeed);
	}
}

const randUID = (chars=10): string => {
	let uuid = '';
	for (let i = 0; i < chars; i++) {
		uuid += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.random() * 100 % 26];
	}

	return uuid;
}

export namespace PatientFeedRepository {
	export const $: interfaces.ServiceIdentifier<PatientFeedRepository> = Symbol('PatientFeedRepository');
}

const patientStatuses: PatientFeed[] = [
	{
		id: "0",
		patientId: "0",
		date: new Date(2023, 7, 27),
		note: "Treatment",
		person: {
			name: "Maria Abarca"
		},
		type: 'status'
	},
	// {
	// 	id: "1",
	// 	patientId: "0",
	// 	date: new Date(2023, 8, 3),
	// 	note: "Maria's status has moved to 'Treatment'- Maria was notified",
	// 	person: {
	// 		name: 'Maria Abarca'
	// 	},
	// 	type: 'status',
	// },
	{
		id: "2",
		patientId: "0",
		date: new Date(2023, 8, 3),
		note: "seen by Dr. Templeton for an initial consultation and massage",
		person: {
			name: 'Maria Abarca'
		},
		type: 'appointment',
	},
	{
		id: "3",
		patientId: "0",
		date: new Date(2023, 8, 15),
		note: "Maria missed her appointment @Todd @Luke",
		person: {
			name: 'Spinal Rehab'
		},
		type: 'comment',
	},
	{
		id: "4",
		patientId: "0",
		date: new Date(2023, 8, 23),
		note: "Maria was seen for a chiropractic appointment",
		person: {
			name: 'Spinal Rehab'
		},
		type: 'comment',
	},
  {
		id: "5",
		patientId: "1",
		date: new Date(2023, 7, 27),
		note: "Treatment",
		person: {
			name: "Maria Abarca"
		},
		type: 'status'
	},
  {
		id: "6",
		patientId: "2",
		date: new Date(2023, 7, 27),
		note: "Treatment",
		person: {
			name: "Maria Abarca"
		},
		type: 'status'
	},
  {
		id: "7",
		patientId: "3",
		date: new Date(2023, 7, 27),
		note: "Treatment",
		person: {
			name: "Maria Abarca"
		},
		type: 'status'
	},
  {
		id: "8",
		patientId: "4",
		date: new Date(2023, 7, 27),
		note: "Treatment",
		person: {
			name: "Maria Abarca"
		},
		type: 'status'
	},
];
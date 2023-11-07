import { interfaces, injectable } from "inversify";
import { DocumentRequest, PatientRequest } from "model/src/patient"

export interface PatientTrackingService {
	getPatient: (firmId: string, patientId: string) => Promise<PatientRequest | undefined>
	getPatients: (firmId: string) => Promise<PatientRequest[]>
	createPatient: (accountId: string, patient: PatientRequest) => Promise<PatientRequest>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace PatientTrackingService {
	export const $: interfaces.ServiceIdentifier<PatientTrackingService> = Symbol('PatientTrackingService');
}

@injectable()
export class TestPatientTrackingService implements PatientTrackingService {
	public getPatient(firmId: string, patientId: string): Promise<PatientRequest | undefined> {
		return Promise.resolve(patients.find(patient => patient.id === patientId));
	}

	public getPatients(): Promise<PatientRequest[]> {
		return Promise.resolve(patients);
	}

	public createPatient(accountId: string, patient: PatientRequest): Promise<PatientRequest> {
		return Promise.resolve(patient);
	}
}
export const _documentRequests: DocumentRequest[] = [
	{
		id: '0',
		patient: {
			id: '0',
			firstName: 'Maria',
			lastName: 'Abarca',
			dateOfBirth: new Date('12/09/1999'),
			dateOfLoss: new Date('1/3/2015'),
			requests: []
		},
		sentEmail: {
			to: {
				id: '0',
				name: 'Spinal Rehab',
				email: 'spinal@rehab.com'
			},
			from: {
				id: '1',
				name: 'Heidi',
				email: 'heidi@craigswapp.com'
			},
			text: 'I am requesting stuff',
			subject: 'Medical Requests',
			date: new Date(),
			id: '0',
			attachments: []
		},
		replies: [
			{
				id: '2',
				date: new Date(),
				from: {
					id: '0',
					name: 'Spinal Rehab',
					email: 'spinal@rehab.com'
				},
				to: {
					id: '1',
					name: 'Heidi',
					email: 'heidi@craigswapp.com'
				},
				text: "Here are your records!",
				subject: 'Re: Medical Requests',
				attachments: ['Record.pdf']
			}
		]
	},
	{
		id: '1',
		patient: {
			id: '1',
			firstName: 'Layne',
			lastName: 'Abbott',
			dateOfBirth: new Date('12/09/2004'),
			dateOfLoss: new Date('10/10/2018'),
			requests: []
		},
		sentEmail: {
			to: {
				id: '2',
				name: 'Intermountain',
				email: 'intermountain@rehab.com'
			},
			from: {
				id: '1',
				name: 'Heidi',
				email: 'heidi@craigswapp.com'
			},
			text: 'I am requesting stuff',
			subject: 'Medical Requests',
			date: new Date(),
			id: '0',
			attachments: []
		},
		replies: []
	},
	{
		id: '2',
		patient: {
			id: '0',
			firstName: 'Maria',
			lastName: 'Abarca',
			dateOfBirth: new Date('12/09/1999'),
			dateOfLoss: new Date('1/3/2015'),
			requests: []
		},
		sentEmail: {
			to: {
				id: '2',
				name: 'Intermountain',
				email: 'intermountain@rehab.com'
			},
			from: {
				id: '1',
				name: 'Heidi',
				email: 'heidi@craigswapp.com'
			},
			text: 'I am requesting stuff',
			subject: 'Medical Requests',
			date: new Date('11/5/2023'),
			id: '0',
			attachments: []
		},
		replies: []
	},
]

const patients: PatientRequest[] = [
	{
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
		requests: _documentRequests.filter(req => req.patient.firstName === 'Maria')
  },
	{
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
		requests: _documentRequests.filter(req => req.patient.firstName === "Abe")
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
		requests: _documentRequests.filter(req => req.patient.firstName === "Layne")
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
		requests: _documentRequests.filter(req => req.patient.firstName === "Ola")
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
		requests: _documentRequests.filter(req => req.patient.firstName === "Claudia")
  },
]
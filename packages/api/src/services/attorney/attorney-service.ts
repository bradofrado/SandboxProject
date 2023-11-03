import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type {AttorneyClient} from 'model/src/attorney';
import type { File } from "../../storage/storage";
import { EmailService } from "../email/email-service";
import 'reflect-metadata';

interface DocumentRequest {
	patient: {
		firstName: string,
		lastName: string,
		middleName: string,
		dateOfBirth: Date,
		phone: string,
		email: string,
	},
	provider: {
		name: string,
		phone: string,
		fax: string,
		email: string
	},
	documents: {
		description: string,
		category: string,
		subCategory: string,
		name: string,
		mimeType: string,
	}[],
	dateOfLoss: Date,
	incidentType: string
}

export interface AttorneyService {
	getClients: (practiceId: string) => Promise<AttorneyClient[]>,
	getClient: (practiceId: string, clientId: string) => Promise<AttorneyClient | undefined>
	exportDocument: (patientId: string, file: File) => Promise<void>
	getRequests: (practiceId: string) => Promise<DocumentRequest[]>
}

@injectable()
export class TestAttorneyService implements AttorneyService {
	constructor(@inject(EmailService.$) private emailService: EmailService) {}

	public async getClients(practiceId: string): Promise<AttorneyClient[]> {
		return Promise.resolve(clients.filter(client => client.lawFirm === practiceId));
	}

	public async getClient(practiceId: string, clientId: string): Promise<AttorneyClient | undefined> {
		return Promise.resolve(clients.find(client => client.id === clientId));
	}

	public exportDocument(): Promise<void> {
		return Promise.resolve();
		//await this.emailService.sendMail({to: 'bradofrado@gmail.com', subject: 'File transfer', body: 'Here are the files you have requested', attachments: [file]});
	}

	public getRequests(_: string): Promise<DocumentRequest[]> {
		//await fetch()
	}
}

@injectable()
export class SmartAdvocateService implements AttorneyService {
	private usedClients: string[] = [];

	public getClients(_: string): Promise<AttorneyClient[]> {
		throw new Error('Not implemented');
		//return Promise.resolve(clients.filter(client => client.lawFirm === practiceId));
	}

	public getClient(_: string, _1: string): Promise<AttorneyClient | undefined> {
		throw new Error('Not implemented');
		//return Promise.resolve(clients.find(client => client.id === clientId));
	}

	public exportDocument(): Promise<void> {
		return Promise.resolve();
		//await this.emailService.sendMail({to: 'bradofrado@gmail.com', subject: 'File transfer', body: 'Here are the files you have requested', attachments: [file]});
	}

	public getRequests(_: string): Promise<DocumentRequest[]> {
		const availableClients = clients.filter(c => !this.usedClients.includes(c.id));
		if (availableClients.length === 0) return Promise.resolve([]);
		const client = availableClients[Math.round(Math.random() * 10) % availableClients.length];
		this.usedClients.push(client.id);

		return Promise.resolve<DocumentRequest[]>([{
			patient: {
				firstName: client.firstName,
				middleName: 'M',
				lastName: client.lastName,
				dateOfBirth: client.dateOfBirth,
				email: client.email,
				phone: client.phone,
			},
			provider: {
				email: 'spinalrehab@gmail.com',
				fax: '',
				phone: '801-999-1929',
				name: client.medicalProvider
			},
			documents: [
				{
					description: "(PDF version of) ",
					category: "Appeals",
					subCategory: "Memo of Law",
					name: "Advise of Defendant Physical Exam Date.pdf",
					mimeType: "application/pdf"
				}
			],
			dateOfLoss: client.dateOfLoss,
			incidentType: client.incidentType
		}]);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace AttorneyService {
	export const $: interfaces.ServiceIdentifier<AttorneyService> = Symbol('AttorneyService');
}

const clients: AttorneyClient[] = [
	{
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 7, 23),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Document Requested',//'Negotiation',
		policyLimit: 1000000,
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Clinical Care",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "layne.abbott@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Litigation',
		policyLimit: 1000000
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Becca Johnson",
    lastUpdateDate: undefined,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "ola.abdullatif@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: undefined,
		policyLimit: 1000000
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Jeb Joe",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "abe.emmanuel@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Referral',//'Litigation',
		policyLimit: 1000000
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "John Cena Care",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "claudia.acero@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "AUTO",
		status: 'Demand',
		policyLimit: 1000000
  },
]
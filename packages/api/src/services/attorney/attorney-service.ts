import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type {AttorneyClient} from 'model/src/attorney';
import { File } from "../../storage/storage";
import { EmailService } from "../email/email-service";

export interface AttorneyService {
	getClients: (practiceId: string) => Promise<AttorneyClient[]>,
	getClient: (practiceId: string, clientId: string) => Promise<AttorneyClient | undefined>
	exportDocument: (patientId: string, file: File) => Promise<void>
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

	public async exportDocument(patientId: string, file: File): Promise<void> {
		await this.emailService.sendMail({to: 'bradofrado@gmail.com', subject: 'File transfer', body: 'Here are the files you have requested', attachments: [file]});
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
    incidentType: "Auto",
		status: 'Document Requested',//'Negotiation',
		limit: 1000000,
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Good Guys Law",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Litigation',
		limit: 1000000
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    lawFirm: "Flickenger & Sutterfield",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Becca Johnson",
    lastUpdateDate: undefined,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: undefined,
		limit: 1000000
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Referral',//'Litigation',
		limit: 1000000
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
		medicalProvider: "Spinal Rehab",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Demand',
		limit: 1000000
  },
]
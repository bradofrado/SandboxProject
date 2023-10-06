import type { interfaces } from "inversify";
import { injectable } from "inversify";
import type {AttorneyClient} from 'model/src/attorney';

export interface AttorneyService {
	getClients: (practiceId: string) => Promise<AttorneyClient[]>,
	getClient: (practiceId: string, clientId: string) => Promise<AttorneyClient | undefined>
}

@injectable()
export class TestAttorneyService implements AttorneyService {
	public async getClients(practiceId: string): Promise<AttorneyClient[]> {
		return Promise.resolve(clients.filter(client => client.lawFirm === practiceId));
	}

	public async getClient(practiceId: string, clientId: string): Promise<AttorneyClient | undefined> {
		return Promise.resolve(clients.find(client => client.id === clientId));
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
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 7, 23),
    //statuses: ["Trial Scheduled", "Reduction Requested"],
    //outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    //notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Negotiation',
		limit: 1000000,
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Good Guys Law",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    //statuses: ["In Legation"],
    //outstandingBalance: 3684.38,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    //notes: "",
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
    primaryContact: "Becca Johnson",
    lastUpdateDate: undefined,
    //statuses: [],
    //outstandingBalance: 19076.02,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    //notes: "",
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
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    //statuses: ["In Legation"],
    //outstandingBalance: 11394,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    //notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Litigation',
		limit: 1000000
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    //statuses: ["Demand Sent", "Reduction Requested"],
    //outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    //notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
		status: 'Demand',
		limit: 1000000
  },
]
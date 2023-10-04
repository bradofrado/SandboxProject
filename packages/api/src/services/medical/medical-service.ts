import { injectable, interfaces } from 'inversify';
import type {Appointment, Patient, PatientDocument, PatientFinanceProvider, PatientListItem, PatientStatus} from 'model/src/patient';

export interface MedicalService {
	getAppointment: (appointmentId: string) => Promise<Appointment>,
	getAppointments: (practiceName: string, patientId: string) => Promise<Appointment[]>
	getCharges: (practiceName: string, patientId: string) => Promise<PatientFinanceProvider[]>,
	getPatient: (patientId: string) => Promise<Patient | undefined>,
	getPatients: (practiceName: string) => Promise<PatientListItem[]>
}

@injectable()
export class TestMedicalService implements MedicalService {
	public getAppointment(appointmentId: string): Promise<Appointment> {

	}

	public getAppointments(practiceName: string, patientId: string): Promise<Appointment[]> {

	}

	public async getCharges(practiceName: string, patientId: string): Promise<PatientFinanceProvider[]> {
		return patientFinanceProviders.filter(
      (financeProvider) => financeProvider.patientId === patientId);
	}

	public async getPatient(patientId: string): Promise<Patient | undefined> {
		const patient = patients.find(_patient => _patient.id === patientId);
		if (patient) {
			const status = patientStatuses.find(_status => _status.patientId === patient.id);
			if (status === undefined) return undefined;

			const charges = await this.getCharges('', patientId);
			return {
				...patient,
				status,
				charges
			}
		}

		return undefined;
	}

	public async getPatients(practiceName: string): Promise<PatientListItem[]> {
		return patients;
	}
}

export namespace MedicalService {
	export const $: interfaces.ServiceIdentifier<MedicalService> = Symbol('MedicalService');
}

const patients: PatientListItem[] = [
  {
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 7, 23),
    statuses: ["Trial Scheduled", "Reduction Requested"],
    outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Good Guys Law",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    statuses: ["In Legation"],
    outstandingBalance: 3684.38,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    lawFirm: "Flickenger & Sutterfield",
    primaryContact: "Becca Johnson",
    lastUpdateDate: null,
    statuses: [],
    outstandingBalance: 19076.02,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    statuses: ["In Legation"],
    outstandingBalance: 11394,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    statuses: ["Demand Sent", "Reduction Requested"],
    outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
];

const patientStatuses: PatientStatus[] = [
  {
    patientId: "0",
    appointments: [
      {
        date: new Date(2023, 7, 27),
        note: "Maria has finished her inital file setup @ Joel",
      },
			{
        date: new Date(2023, 8, 3),
        note: "Maria's status has moved to 'Treatment'- Maria was notified",
      },
			{
        date: new Date(2023, 8, 3),
        note: "Maria was seen by Dr. Templeton for an initial consultation and massage",
      },
			{
        date: new Date(2023, 8, 15),
        note: "Maria missed her appointment @Todd @Luke",
      },
			{
        date: new Date(2023, 8, 23),
        note: "Maria was seen for a chiropractic appointment",
      },
    ],
    status: "Treatment",
  },
  {
    patientId: "1",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Demand",
  },
  {
    patientId: "2",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "File Setup",
  },
  {
    patientId: "3",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Settlement",
  },
  {
    patientId: "4",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Treatment",
  },
];

const patientFinanceProviders: PatientFinanceProvider[] = [
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 200,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 120.5,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 75,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 90.15,
  },
  {
    patientId: "1",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "2",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "3",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "4",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
];

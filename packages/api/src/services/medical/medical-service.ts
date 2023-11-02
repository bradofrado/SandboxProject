import type { interfaces } from 'inversify';
import { injectable } from 'inversify';
import {type PatientFeed} from 'model/src/patient';
import type {MedicalPatient, MedicalCharge} from 'model/src/medical';
import 'reflect-metadata'

export interface MedicalService {
	getAppointments: (practiceId: string, patientId: string) => Promise<PatientFeed[]>
	getCharges: (practiceId: string, patientId: string) => Promise<MedicalCharge[]>,
	getPatient: (practiceId: string, patientId: string) => Promise<MedicalPatient | undefined>,
	getPatients: (practiceId: string) => Promise<MedicalPatient[]>
}

@injectable()
export class TestMedicalService implements MedicalService {
	public async getAppointments(practiceId: string, patientId: string): Promise<PatientFeed[]> {
		//const patientStatus = patientStatuses.filter(status => status.patientId === patientId);
		return Promise.resolve([]);
	}

	public async getCharges(practiceId: string, patientId: string): Promise<MedicalCharge[]> {
		return Promise.resolve(patientFinanceProviders.filter(
      (financeProvider) => financeProvider.patientId === patientId));
	}

	public async getPatient(practiceId: string, patientId: string): Promise<MedicalPatient | undefined> {
		const patient = patients.find(_patient => _patient.id === patientId);
		return Promise.resolve(patient);
	}

	public async getPatients(_: string): Promise<MedicalPatient[]> {
		return Promise.resolve(patients);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace MedicalService {
	export const $: interfaces.ServiceIdentifier<MedicalService> = Symbol('MedicalService');
}

const patients: MedicalPatient[] = [
  {
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    dateOfBirth: new Date(),
    //dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    //incidentType: "Auto",
		lawFirm: 'Siegfried and Jensen'
  },
	{
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    dateOfBirth: new Date(),
    //dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    //incidentType: "Auto",
		lawFirm: 'Siegfried and Jensen',
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    dateOfBirth: new Date(),
    //dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    //incidentType: "Auto",
		lawFirm: 'Good Guys Law'
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    dateOfBirth: new Date(),
    //dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    //incidentType: "Auto",
		lawFirm: 'Flickenger and Sutterfield'
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    dateOfBirth: new Date(),
    //dateOfLoss: new Date(),
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    //incidentType: "Auto",
		lawFirm: 'Siegfried and Jensen'
  },
];

const patientFinanceProviders: (MedicalCharge & {patientId: string})[] = [
  {
    patientId: "0",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "0",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 200,
  },
  {
    patientId: "0",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 120.5,
  },
  {
    patientId: "0",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 75,
  },
  {
    patientId: "0",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 90.15,
  },
  {
    patientId: "1",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
	{
    patientId: "1",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 200,
  },
  {
    patientId: "1",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 120.5,
  },
  {
    patientId: "1",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 75,
  },
  {
    patientId: "2",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
	{
    patientId: "2",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 553,
  },
  {
    patientId: "2",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 101.5,
  },
  {
    patientId: "2",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 65,
  },
  {
    patientId: "3",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 155.34,
  },
	{
    patientId: "3",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 439,
  },
  {
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
	{
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 144,
  },
  {
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 100.5,
  },
  {
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Paid",
    amount: 79,
  },
	{
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 221,
  },
  {
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 400.5,
  },
  {
    patientId: "4",
    providerName: "Joel Templeton",
    status: "Unpaid",
    amount: 95,
  },
];

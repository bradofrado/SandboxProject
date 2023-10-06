import {createClient as soapCreateClient} from 'soap';
import type { Appointment, Patient, PatientFinanceProvider, Patient } from 'model/src/patient';
import type { MedicalService } from '../medical-service';
import type { GetAppointmentRequest, GetAppointmentResponse, GetAppointmentsRequest, GetAppointmentsResponse, GetChargesRequest, GetChargesResponse, GetPatientRequest, GetPatientResponse, GetPatientsRequest, GetPatientsResponse, KareoClient, KareoRequest} from './types';
import { KareoClientSchema } from './types';
import { getAppointmentResponseToAppointment, getAppointmentsResponseToAppointments, getChargesResponseToCharges, getPatientResponseToPatient, getPatientsResponseToPatients } from './utils';

export class KareoMedicalService implements MedicalService {
	private serviceUrl = 'https://webservice.kareo.com/services/soap/2.1/KareoServices.svc?wsdl'
	private client!: KareoClient;
	
	constructor(private user: string, private password: string, private customerKey: string) {
		this.createClient();
	}

	private createClient(): void {
		soapCreateClient(this.serviceUrl, (err, client) => {
			const result = KareoClientSchema.safeParse(client);
			if (result.success) {
				this.client = result.data as KareoClient;
			} else {
				throw new Error(result.error.message);
			}
		})
	}

	private createRequest<T extends KareoRequest>(args: Omit<T, keyof KareoRequest>): T {
		return {...args, User: this.user, Password: this.password, CustomerKey: this.customerKey} as T;
	}

	public async getAppointment(appointmentId: string): Promise<Appointment> {
		const request: GetAppointmentRequest = this.createRequest<GetAppointmentRequest>({
			AppointmentId: appointmentId,
		});
		
		const response: GetAppointmentResponse = await this.client.GetAppointment(request);

		return getAppointmentResponseToAppointment(response);
	}

	public async getAppointments(practiceName: string, patientId: string): Promise<Appointment[]> {
		const request: GetAppointmentsRequest = this.createRequest<GetAppointmentsRequest>({
			PracticeName: practiceName,
			PatientID: patientId
		});
		
		const response: GetAppointmentsResponse = await this.client.GetAppointments(request);

		return getAppointmentsResponseToAppointments(response);
	}

	public async getCharges(practiceName: string): Promise<PatientFinanceProvider[]> {
		const request: GetChargesRequest = this.createRequest<GetChargesRequest>({PracticeName: practiceName});

		const response: GetChargesResponse = await this.client.GetCharges(request);

		return getChargesResponseToCharges(response);
	}

	public async getPatient(patientId: string): Promise<Patient> {
		const request: GetPatientRequest = this.createRequest<GetPatientRequest>({PatientId: patientId});

		const response: GetPatientResponse = await this.client.GetPatient(request);

		return getPatientResponseToPatient(response);
	}

	public async getPatients(practiceName: string): Promise<Patient[]> {
		const request: GetPatientsRequest = this.createRequest<GetPatientsRequest>({PracticeName: practiceName});

		const response: GetPatientsResponse = await this.client.GetPatients(request);

		return getPatientsResponseToPatients(response);
	}
}
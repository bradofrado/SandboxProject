import type { Appointment, Charge } from "model/src/medical";
import type {Patient} from 'model/src/patient';

export interface MedicalService {
	getAppointment: (appointmentId: string) => Promise<Appointment>,
	getCharges: (practiceName: string) => Promise<Charge[]>,
	getPatient: (patientId: string) => Promise<Patient>,
	getPatients: (practiceName: string) => Promise<Patient[]>
}
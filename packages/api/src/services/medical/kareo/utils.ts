import type { Appointment, Patient, PatientFinanceProvider, PatientListItem } from "model/src/patient";
import type { GetAppointmentResponse, GetAppointmentsResponse, GetChargesResponse, GetPatientResponse, GetPatientsResponse } from "./types";

export function getAppointmentResponseToAppointment(response: GetAppointmentResponse): Appointment {
	return {

	}
}

export function getAppointmentsResponseToAppointments(response: GetAppointmentsResponse): Appointment[] {
	return []
}

export function getChargesResponseToCharges(response: GetChargesResponse): PatientFinanceProvider[] {
	return []
}

export function getPatientResponseToPatient(response: GetPatientResponse): Patient {
	return {

	}
}

export function getPatientsResponseToPatients(response: GetPatientsResponse): PatientListItem[] {
	return []
}
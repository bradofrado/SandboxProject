import type { Charge } from "model/src/medical";
import type { Appointment, Patient } from "model/src/patient";
import type { GetAppointmentResponse, GetChargesResponse, GetPatientResponse, GetPatientsResponse } from "./types";

export function getAppointmentResponseToAppointment(response: GetAppointmentResponse): Appointment {
	return {

	}
}

export function getChargesResponseToCharges(response: GetChargesResponse): Charge[] {
	return []
}

export function getPatientResponseToPatient(response: GetPatientResponse): Patient {
	return {

	}
}

export function getPatientsResponseToPatients(response: GetPatientsResponse): Patient[] {
	return []
}
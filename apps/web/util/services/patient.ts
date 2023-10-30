import { PatientFeed } from "model/src/patient";
import { api } from "../api";

// type UseQuery = {
// 	[P in keyof typeof api['patients']]: typeof api['patients'][P] extends {useQuery: (...args: any) => infer R} ? R : never
// }

// type UseQuery<T extends keyof typeof api.patients> = {
// 	[P in keyof typeof api['patients']]: typeof api['patients'][P] extends {useQuery: (...args: any) => infer R} ? R : never
// }[T]

export const useGetPatients = () => {
  return api.patients.getPatients.useQuery();
};


export const useGetPatient = (
  id: string,
) => {
  return api.patients.getPatient.useQuery({patientId: id})
};

export const useGetPatientStatus = (
  patientId: string,
) => {
  return api.patients.getAppointments.useQuery({patientId})
};

export const usePatientStatusComment = () => {
	const query = api.patients.createFeed.useMutation();
	const client = api.useContext();

	return {
		...query,
		mutate: (comment: string, patientId: string) => {
			const newFeed: PatientFeed = {
				patientId,
				id: '',
				date: new Date(),
				note: comment,
				type: 'comment',
				person: {
					name: 'Spinal Rehab'
				}
			}

			query.mutate(newFeed, {
				async onSuccess() {
					await client.patients.getAppointments.invalidate();
				}
			});
		}
	}
}

export const useGetPatientDocuments = (
  patientId: string,
) => {
  return api.documents.getDocuments.useQuery({path: patientId});
};

export const useGetPatientFinanceProviders = (
  patientId: string,
) => {
  return api.patients.getCharges.useQuery({patientId});
};


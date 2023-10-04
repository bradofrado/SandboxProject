import { api } from "../api";

// type UseQuery = {
// 	[P in keyof typeof api['patients']]: typeof api['patients'][P] extends {useQuery: (...args: any) => infer R} ? R : never
// }

export const useGetPatients = () => {
  return api.patients.getPatients.useQuery({firmId: 'this is an id'});
};

export const useGetPatient = (
  id: string,
) => {
  return api.patients.getPatient.useQuery({firmId: 'An id', patientId: id})
};

export const useGetPatientStatus = (
  patientId: string,
) => {
  const query = useGetPatient(patientId);
	if (query.isError || query.isLoading) {
		return {
			...query,
			data: undefined
		}
	}

	return {
		...query,
		data: query.data?.status
	};
};

export const useGetPatientDocuments = (
  patientId: string,
) => {
  return api.documents.getDocuments.useQuery({path: patientId});
};

export const useGetPatientFinanceProviders = (
  patientId: string,
) => {
  const query = useGetPatient(patientId);
	if (query.isError || query.isLoading) {
		return {
			...query,
			data: undefined
		}
	}

	return {
		...query,
		data: query.data?.charges
	};
};


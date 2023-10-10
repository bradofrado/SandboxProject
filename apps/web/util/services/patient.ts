import { api } from "../api";

// type UseQuery = {
// 	[P in keyof typeof api['patients']]: typeof api['patients'][P] extends {useQuery: (...args: any) => infer R} ? R : never
// }

// type UseQuery<T extends keyof typeof api.patients> = {
// 	[P in keyof typeof api['patients']]: typeof api['patients'][P] extends {useQuery: (...args: any) => infer R} ? R : never
// }[T]

export const useGetPatients = () => {
  return api.patients.getPatients.useQuery({firmId: 'clnjqyuw00001uu4c1kak9obf'});
};


export const useGetPatient = (
  id: string,
) => {
  return api.patients.getPatient.useQuery({firmId: 'clnjqyuw00001uu4c1kak9obf', patientId: id})
};

export const useGetPatientStatus = (
  patientId: string,
) => {
  return api.patients.getAppointments.useQuery({firmId: 'clnjqyuw00001uu4c1kak9obf', patientId})
};

export const useGetPatientDocuments = (
  patientId: string,
) => {
  return api.documents.getDocuments.useQuery({path: patientId});
};

export const useGetPatientFinanceProviders = (
  patientId: string,
) => {
  return api.patients.getCharges.useQuery({firmId: 'clnjqyuw00001uu4c1kak9obf', patientId});
};


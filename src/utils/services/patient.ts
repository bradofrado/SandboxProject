import { type Patient } from "../types/patient"

export const useGetPatients = () => {
    return {
        isLoading: false,
        isError: false,
        data: patients
    }
}

export const useGetPatient = (id: string) => {
    return {
        isLoading: false,
        isError: false,
        data: patients.find(patient => patient.id == id)
    }
}

const patients: Patient[] = [
    {
        name: 'John Doe',
        id: '1',
        dateOfBirth: new Date(),
        dateOfLoss: new Date(),
        status: 'In Legation',
        notes: 'This here is a patient alright',
        appointments: [new Date()]
    },
    {
        name: 'Jennifer Johnson',
        id: '2',
        dateOfBirth: new Date(),
        dateOfLoss: new Date(),
        status: 'Dead',
        notes: 'Another patient in the grave',
        appointments: [new Date()]
    }
];
import { Patient } from "../types/patient"

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
        status: 'In Legation'
    },
    {
        name: 'Jennifer Johnson',
        id: '2',
        dateOfBirth: new Date(),
        dateOfLoss: new Date(),
        status: 'Dead'
    }
]
import type { Patient } from "model/src/patient";

export const useGetPatients = (): {
  isLoading: boolean;
  isError: boolean;
  data: Patient[];
} => {
  return {
    isLoading: false,
    isError: false,
    data: patients,
  };
};

export const useGetPatient = (
  id: string,
): { isLoading: boolean; isError: boolean; data: Patient | undefined } => {
  return {
    isLoading: false,
    isError: false,
    data: patients.find((patient) => patient.id === id),
  };
};

const patients: Patient[] = [
  {
    id: "0",
    firstName: "Maria",
    lastName: "Abarca",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 7, 23),
    statuses: ["Trial Scheduled", "Reduction Requested"],
    outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    appointments: [],
    notes: "",
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Good Guys Law",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    statuses: ["In Legation"],
    outstandingBalance: 3684.38,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    appointments: [],
    notes: "",
  },
  {
    id: "2",
    firstName: "Ola",
    lastName: "Abdullatif",
    lawFirm: "Flickenger & Sutterfield",
    primaryContact: "Becca Johnson",
    lastUpdateDate: null,
    statuses: [],
    outstandingBalance: 19076.02,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    appointments: [],
    notes: "",
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    statuses: ["In Legation"],
    outstandingBalance: 11394,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    appointments: [],
    notes: "",
  },
  {
    id: "4",
    firstName: "Claudia",
    lastName: "Acero",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 6, 30),
    statuses: ["Demand Sent", "Reduction Requested"],
    outstandingBalance: 1941.69,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    appointments: [],
    notes: "",
  },
];

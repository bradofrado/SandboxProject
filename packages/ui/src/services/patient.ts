import type {
  Patient,
  PatientDocument,
  PatientFinanceProvider,
  PatientStatus,
} from "model/src/patient";

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

export const useGetPatientStatus = (
  patientId: string,
): {
  isLoading: boolean;
  isError: boolean;
  data: PatientStatus | undefined;
} => {
  return {
    isLoading: false,
    isError: false,
    data: patientStatuses.find((status) => status.patientId === patientId),
  };
};

export const useGetPatientDocuments = (
  patientId: string,
): { isLoading: boolean; isError: boolean; data: PatientDocument[] } => {
  return {
    isLoading: false,
    isError: false,
    data: patientDocuments.filter(
      (document) => document.patientId === patientId,
    ),
  };
};

export const useGetPatientFinanceProviders = (
  patientId: string,
): { isLoading: boolean; isError: boolean; data: PatientFinanceProvider[] } => {
  return {
    isLoading: false,
    isError: false,
    data: patientFinanceProviders.filter(
      (financeProvider) => financeProvider.patientId === patientId,
    ),
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
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "1",
    firstName: "Layne",
    lastName: "Abbott",
    lawFirm: "Good Guys Law",
    primaryContact: "Clint Peterson",
    lastUpdateDate: new Date(2023, 8, 2),
    statuses: ["In Litigation"],
    outstandingBalance: 3684.38,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
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
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
  {
    id: "3",
    firstName: "Abe",
    lastName: "Emmanuel",
    lawFirm: "Siegfried and Jensen",
    primaryContact: "Jeremy Richards",
    lastUpdateDate: new Date(2023, 5, 18),
    statuses: ["In Litigation"],
    outstandingBalance: 11394,
    dateOfBirth: new Date(),
    dateOfLoss: new Date(),
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
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
    notes: "",
    email: "maria.abarca@gmail.com",
    phone: "(801) 999-9999",
    incidentType: "Auto",
  },
];

const patientStatuses: PatientStatus[] = [
  {
    patientId: "0",
    appointments: [
      {
        date: new Date(2023, 7, 27),
        note: "Maria has finished her inital file setup @ Joel",
      },
			{
        date: new Date(2023, 8, 3),
        note: "Maria's status has moved to 'Treatment'- Maria was notified",
      },
			{
        date: new Date(2023, 8, 3),
        note: "Maria was seen by Dr. Templeton for an initial consultation and massage",
      },
			{
        date: new Date(2023, 8, 15),
        note: "Maria missed her appointment @Todd @Luke",
      },
			{
        date: new Date(2023, 8, 23),
        note: "Maria was seen for a chiropractic appointment",
      },
    ],
    status: "Treatment",
  },
  {
    patientId: "1",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Demand",
  },
  {
    patientId: "2",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "File Setup",
  },
  {
    patientId: "3",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Settlement",
  },
  {
    patientId: "4",
    appointments: [
      {
        date: new Date(2023, 1, 10),
        note: "Maria has finished her inital file setup @ Joel",
      },
    ],
    status: "Treatment",
  },
];

const patientDocuments: PatientDocument[] = [
  {
    patientId: "0",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
    patientId: "0",
    name: "Medical Records",
    lastUpdate: new Date(2023, 8, 26, 13, 15),
    path: "/",
    size: 6000000,
    type: "folder",
  },
  {
    patientId: "0",
    name: "Legal Docs",
    lastUpdate: new Date(2023, 7, 27, 13, 15),
    path: "/",
    size: 6000000,
    type: "folder",
  },
  {
    patientId: "1",
    name: "Braydon.jpeg",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/braydon.jpeg",
    size: 6000000,
    type: "img",
  },
  {
    patientId: "2",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file-paged.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
    patientId: "3",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file-paged.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
    patientId: "4",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file.pdf",
    size: 6000000,
    type: "pdf",
  },
];

const patientFinanceProviders: PatientFinanceProvider[] = [
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 200,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 120.5,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 75,
  },
  {
    patientId: "0",
    name: "Joel Templeton",
    status: "Unpaid",
    amount: 90.15,
  },
  {
    patientId: "1",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "2",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "3",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
  {
    patientId: "4",
    name: "Joel Templeton",
    status: "Paid",
    amount: 185.34,
  },
];

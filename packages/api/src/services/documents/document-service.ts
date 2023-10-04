import { PatientDocument } from "model/src/patient";

export interface DocumentService {
	getDocuments: (path: string) => Promise<PatientDocument[]>
}

export class TestDocumentService implements DocumentService {
	public async getDocuments(path: string): Promise<PatientDocument[]> {
		const documents = patientDocuments.filter(doc => doc.patientId === path);
		console.log(documents);
		return documents;
	}
}

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
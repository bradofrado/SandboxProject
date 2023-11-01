import { PrismaClient } from "db/lib/prisma";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { PatientDocument } from "model/src/patient";

export interface DocumentRepository {
	createDocument: (document: PatientDocument, previewPath: string) => Promise<PatientDocument>
	getDocuments: (patientId: string) => Promise<PatientDocument[]>
	getPath: (documentId: string) => Promise<string | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace DocumentRepository {
	export const $: interfaces.ServiceIdentifier<DocumentRepository> = Symbol('DocumentRepository');
}


@injectable()
export class TestDocumentRepository implements DocumentRepository {
	public createDocument(document: PatientDocument): Promise<PatientDocument> {
		patientDocuments.push(document);

		return Promise.resolve(document);
	}

	public getDocuments(patientId: string): Promise<PatientDocument[]> {
		const documents = patientDocuments.filter(doc => doc.patientId === patientId);
		return Promise.resolve(documents);
	}

	public getPath(documentId: string): Promise<string | undefined> {
		const document = patientDocuments.find(doc => doc.id === documentId);
		return Promise.resolve(document?.path);
	}
}

@injectable()
export class PrismaDocumentRepository implements DocumentRepository {
	constructor(@inject('Prisma') private prisma: PrismaClient) {}

	public async createDocument(document: PatientDocument, previewPath: string): Promise<PatientDocument> {
		const newDocument = await this.prisma.document.create({
			data: {
				...document,
				previewPath
			}
		})

		return this.prismaToPatientDocument(newDocument);
	}

	public async getDocuments(patientId: string): Promise<PatientDocument[]> {
		const documents = await this.prisma.document.findMany({
			where: {
				patientId
			}
		});

		return documents.map(document => this.prismaToPatientDocument(document));
	} 

	public async getPath(documentId: string): Promise<string | undefined> {
		const document = await this.prisma.document.findUnique({
			where: {
				id: documentId
			}
		});

		return document?.path;
	}

	private prismaToPatientDocument(prismaDoc: {
			id: string;
			patientId: string;
			name: string;
			previewPath: string;
			path: string;
			lastUpdate: Date;
			size: number;
			type: "img" | "pdf" | "folder";
	}): PatientDocument {
		return {
			id: prismaDoc.id,
			patientId: prismaDoc.patientId,
			name: prismaDoc.name,
			path: prismaDoc.previewPath,
			lastUpdate: prismaDoc.lastUpdate,
			size: prismaDoc.size,
			type: prismaDoc.type
		}
	}
}

const patientDocuments: PatientDocument[] = [
  {
		id: "0",
    patientId: "0",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
		id: "1",
    patientId: "0",
    name: "Medical Records",
    lastUpdate: new Date(2023, 8, 26, 13, 15),
    path: "/",
    size: 6000000,
    type: "folder",
  },
  {
		id: "2",
    patientId: "0",
    name: "Legal Docs",
    lastUpdate: new Date(2023, 7, 27, 13, 15),
    path: "/",
    size: 6000000,
    type: "folder",
  },
  {
		id: "3",
    patientId: "1",
    name: "Braydon.jpeg",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/braydon.jpeg",
    size: 6000000,
    type: "img",
  },
  {
		id: "4",
    patientId: "2",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file-paged.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
		id: "5",
    patientId: "3",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file-paged.pdf",
    size: 6000000,
    type: "pdf",
  },
  {
		id: "6",
    patientId: "4",
    name: "Maria Abarca Release form.pdf",
    lastUpdate: new Date(2023, 8, 27, 13, 15),
    path: "/pdf-file.pdf",
    size: 6000000,
    type: "pdf",
  },
];
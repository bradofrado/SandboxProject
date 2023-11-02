import { PrismaClient } from "db/lib/prisma";
import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { PatientDocument } from "model/src/patient";
import 'reflect-metadata';

export interface DocumentRepository {
	createDocument: (document: PatientDocument, token: string) => Promise<PatientDocument>
	getDocuments: (patientId: string) => Promise<PatientDocument[]>
	getDocument: (documentId: string) => Promise<PatientDocument | undefined>
	getToken: (documentId: string) => Promise<string | undefined>
	deleteDocument: (documentId: string) => Promise<void>
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

	public getDocument(documentId: string): Promise<PatientDocument | undefined> {
		return Promise.resolve(patientDocuments.find(doc => doc.id === documentId));
	}

	public getToken(): Promise<string | undefined> {
		return Promise.resolve('');
	}

	public deleteDocument(documentId: string): Promise<void> {
		const index = patientDocuments.findIndex(document => document.id === documentId);
		if (index > -1) {
			patientDocuments.splice(index);
		}

		return Promise.resolve();
	}
}

@injectable()
export class PrismaDocumentRepository implements DocumentRepository {
	constructor(@inject('Prisma') private prisma: PrismaClient) {}

	public async createDocument(document: PatientDocument, token: string): Promise<PatientDocument> {
		const newDocument = await this.prisma.document.create({
			data: {...document, token}
		})

		return {
			id: newDocument.id,
			name: newDocument.name,
			lastUpdate: newDocument.lastUpdate,
			path: newDocument.path,
			patientId: newDocument.patientId,
			size: newDocument.size,
			type: newDocument.type
		}
	}

	public async getDocuments(patientId: string): Promise<PatientDocument[]> {
		const document = await this.prisma.document.findMany({
			where: {
				patientId
			}
		});

		return document;
	} 

	public async getDocument(documentId: string): Promise<PatientDocument | undefined> {
		const document = await this.prisma.document.findUnique({
			where: {
				id: documentId
			}
		});

		if (document === null) {
			return undefined;
		}

		return {
			id: document.id,
			name: document.name,
			lastUpdate: document.lastUpdate,
			path: document.path,
			patientId: document.patientId,
			size: document.size,
			type: document.type
		}
	}

	public async getToken(documentId: string): Promise<string | undefined> {
		const document = await this.prisma.document.findUnique({
			where: {
				id: documentId
			}
		});

		return document?.token;
	}

	public async deleteDocument(documentId: string): Promise<void> {
		await this.prisma.document.delete({
			where: {
				id: documentId
			}
		})
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
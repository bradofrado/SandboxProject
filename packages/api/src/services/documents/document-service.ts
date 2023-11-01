import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { PatientDocument } from "model/src/patient";
import 'reflect-metadata';
import type { Encryption, File, Scanner, Storage, UploadFlowFactory } from "../../storage/storage";
import { UploadCareFlowFactory } from "../../storage/upload-care-storage";
import { DocumentRepository } from "../../repository/document-repository";

export interface DocumentService {
	getDocuments: (patientId: string) => Promise<PatientDocument[]>;
	getDocumentPrivatePath: (documentId: string) => Promise<string>;
	uploadDocument: (userId: string, patientId: string, document: File) => Promise<string>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace DocumentService {
	export const $: interfaces.ServiceIdentifier<DocumentService> = Symbol('DocumentService');
}

@injectable()
export class TestDocumentService implements DocumentService {
	private uploadRequest: UploadRequest;
	
	constructor(@inject(DocumentRepository.$) private documentRepository: DocumentRepository) {
		this.uploadRequest = new UploadRequest(new UploadCareFlowFactory(), this.documentRepository);
	}
	public getDocuments(patientId: string): Promise<PatientDocument[]> {
		return this.documentRepository.getDocuments(patientId);
	}

	public uploadDocument(userId: string, patientId: string, file: File): Promise<string> {
		return this.uploadRequest.upload(userId, patientId, file);
	}

	public async getDocumentPrivatePath(documentId: string): Promise<string> {
		return this.uploadRequest.download(documentId);
	}
}

export class UploadRequest {
	private storage: Storage;
	private scanner: Scanner;
	private encryption: Encryption;

	constructor(factory: UploadFlowFactory, private documentRepository: DocumentRepository) {
		const {storage, scanner, encryption} = factory.getClasses();
		this.storage = storage;
		this.scanner = scanner;
		this.encryption = encryption;
	}

	public async upload(userId: string, patientId: string, file: File): Promise<string> {
		if (await this.scanner.scan(file)) {
			throw new Error('Invalid File');
		}

		const encryptedFile = await this.encryption.encrypt(userId, file);
		const id = randUID();
		
		const token = await this.storage.upload(encryptedFile);

		const previewPath = `/api/preview/${id}`;

		const document = await this.documentRepository.createDocument({id, patientId, path: previewPath, name: file.name, lastUpdate: new Date(), size: file.size, type: 'img'}, token);

		return document.id;
	}

	public async download(documentId: string): Promise<string> {
		const token = await this.documentRepository.getToken(documentId);
		if (token === undefined) {
			throw new Error(`Invalid document id for download ${documentId}`);
		}

		return this.storage.download(token);
	}
}

const randUID = (chars=10): string => {
	let uuid = '';
	for (let i = 0; i < chars; i++) {
		uuid += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[(Math.floor(Math.random() * 100)) % 26];
	}

	return uuid;
}
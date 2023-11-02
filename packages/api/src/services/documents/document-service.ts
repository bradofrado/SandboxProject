import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { PatientDocument } from "model/src/patient";
import type { Encryption, File, Scanner, Storage, UploadFlowFactory } from "../../storage/storage";
import { UploadCareFlowFactory } from "../../storage/upload-care-storage";
import { DocumentRepository } from "../../repository/document-repository";
import { AttorneyRegistry } from "../attorney/attorney-registry";
import { PatientService } from "../patient/patient-service";
import { ProviderAccountRepository } from "../../repository/provider-account";
import 'reflect-metadata';

export interface DocumentService {
	getDocuments: (patientId: string) => Promise<PatientDocument[]>;
	getDocumentPrivatePath: (documentId: string) => Promise<string>;
	uploadDocument: (userId: string, patientId: string, document: File) => Promise<string>;
	deleteDocuments: (documentIds: string[]) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- namespace is ok here
export namespace DocumentService {
	export const $: interfaces.ServiceIdentifier<DocumentService> = Symbol('DocumentService');
}

@injectable()
export class TestDocumentService implements DocumentService {
	private uploadRequest: UploadRequest;
	
	constructor(@inject(DocumentRepository.$) private documentRepository: DocumentRepository, 
		@inject(AttorneyRegistry.$) private attorneyRegistry: AttorneyRegistry, 
		@inject(PatientService.$) private patientService: PatientService,
		@inject(ProviderAccountRepository.$) private providerAccountRepository: ProviderAccountRepository,) {
		this.uploadRequest = new UploadRequest(new UploadCareFlowFactory(), this.documentRepository);
	}
	public getDocuments(patientId: string): Promise<PatientDocument[]> {
		return this.documentRepository.getDocuments(patientId);
	}

	public async uploadDocument(userId: string, patientId: string, file: File): Promise<string> {
		const id = await this.uploadRequest.upload(userId, patientId, file);
		const patient = await this.patientService.getPatient(userId, patientId);
		if (patient === undefined) {
			throw new Error('Invalid user id or patient id');
		}
		const attorneyAccount = await this.providerAccountRepository.getAccount(patient.lawFirm);
		if (attorneyAccount === undefined) {
			throw new Error('Invalid patient');
		}
		const attorneyService = this.attorneyRegistry.getService(attorneyAccount.integration);

		await attorneyService.exportDocument(userId, patientId, file);

		return id;
	}

	public async getDocumentPrivatePath(documentId: string): Promise<string> {
		return this.uploadRequest.download(documentId);
	}

	public async deleteDocuments(documentIds: string[]): Promise<void> {
		await this.uploadRequest.delete(documentIds);
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

	public async delete(documentIds: string[]): Promise<void> {
		const results: Promise<void>[] = [];
		for (const documentId of documentIds) {
			results.push(this.deleteSingle(documentId)); 
		}

		await Promise.all(results);
	}

	private async deleteSingle(documentId: string): Promise<void> {
		const token = await this.documentRepository.getToken(documentId);
		if (token === undefined) {
			throw new Error(`Invalid document id for download ${documentId}`);
		}

		await this.storage.delete(token);
		await this.documentRepository.deleteDocument(documentId);
	}
}

const randUID = (chars=10): string => {
	let uuid = '';
	for (let i = 0; i < chars; i++) {
		uuid += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[(Math.floor(Math.random() * 100)) % 26];
	}

	return uuid;
}
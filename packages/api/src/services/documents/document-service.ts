import type { interfaces } from "inversify";
import { inject, injectable } from "inversify";
import type { PatientDocument } from "model/src/patient";
import 'reflect-metadata';
import type { File, UploadFlowFactory } from "../../storage/storage";
import { UploadCareFlowFactory } from "../../storage/upload-care-storage";
import { DocumentRepository } from "../../repository/document-repository";

export interface DocumentService {
	getDocuments: (path: string) => Promise<PatientDocument[]>
	uploadDocument: (userId: string, patientId: string, document: File) => Promise<string>
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
	public getDocuments(path: string): Promise<PatientDocument[]> {
		return this.documentRepository.getDocuments(path);
	}

	public uploadDocument(userId: string, patientId: string, file: File): Promise<string> {
		return this.uploadRequest.upload(userId, patientId, file);
	}
}

export class UploadRequest {
	constructor(private factory: UploadFlowFactory, private documentRepository: DocumentRepository) {}

	public async upload(userId: string, patientId: string, file: File): Promise<string> {
		const {storage, scanner, encryption} = this.factory.getClasses();
		
		if (await scanner.scan(file)) {
			throw new Error('Invalid File');
		}

		const encryptedFile = await encryption.encrypt(userId, file);
		const id = randUID();
		
		const filePath = await storage.upload({
			name: file.name,
			body: encryptedFile.body
		})

		const document = await this.documentRepository.createDocument({id, patientId, path: filePath, name: file.name, lastUpdate: new Date(), size: file.size, type: 'img'});

		return document.id;
	}
}

const randUID = (chars=10): string => {
	let uuid = '';
	for (let i = 0; i < chars; i++) {
		uuid += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[(Math.floor(Math.random() * 100)) % 26];
	}

	return uuid;
}
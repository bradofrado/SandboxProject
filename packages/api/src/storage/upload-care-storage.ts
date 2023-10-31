import { uploadFile } from "@uploadcare/upload-client";
import type { Storage, StorageDocument, UploadFlowFactory, UploadFlowFactoryClasses } from "./storage";
import { NullEncryption, NullScanner } from "./storage";

export class UploadCareStorage implements Storage {
	constructor(private publicKey: string) {}
	public async upload(document: StorageDocument): Promise<string> {
		const result = await uploadFile(document.body, {
			publicKey: this.publicKey,
			store: 'auto'
		});

		return result.cdnUrl || '';
	}

	// public async download(documentId: string): Promise<StorageDocument> {

	// }
}


export class UploadCareFlowFactory implements UploadFlowFactory {
	public getClasses(): UploadFlowFactoryClasses {
		const publicKey = process.env.UPLOAD_CARE_PUBLIC_KEY;
		if (!publicKey) {
			throw new Error('Invalid public key');
		}
		return {
			storage: new UploadCareStorage(publicKey),
			encryption: new NullEncryption(),
			scanner: new NullScanner()
		}
	}
}
import { uploadFile } from "@uploadcare/upload-client";
import type { File, Storage, UploadFlowFactory, UploadFlowFactoryClasses } from "./storage";
import { NullEncryption, NullScanner } from "./storage";

const HOST = 'https://ucarecdn.com';

export class UploadCareStorage implements Storage {
	constructor(private publicKey: string) {}
	public async upload(document: File): Promise<string> {
		const result = await uploadFile(document.body, {
			publicKey: this.publicKey,
			store: 'auto'
		});

		return result.uuid;
	}

	public async download(token: string): Promise<string> {
		return Promise.resolve(`${HOST}/${token}/-/preview/500x500/-/quality/smart/-/format/auto/`);
	}
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
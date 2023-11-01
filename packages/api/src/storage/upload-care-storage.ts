import { uploadFile } from "@uploadcare/upload-client";
import { deleteFile, UploadcareSimpleAuthSchema } from "@uploadcare/rest-client";
import type { File, Storage, UploadFlowFactory, UploadFlowFactoryClasses } from "./storage";
import { NullEncryption, NullScanner } from "./storage";

const HOST = 'https://ucarecdn.com';

export class UploadCareStorage implements Storage {
	constructor(private publicKey: string, private privateKey: string) {}
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

	public async delete(token: string): Promise<void> {
		const authSchema = new UploadcareSimpleAuthSchema({
			publicKey: this.publicKey,
			secretKey: this.privateKey,
		});
		await deleteFile({uuid: token}, {
			authSchema
		});
	}
}


export class UploadCareFlowFactory implements UploadFlowFactory {
	public getClasses(): UploadFlowFactoryClasses {
		const publicKey = process.env.UPLOAD_CARE_PUBLIC_KEY;
		const privateKey = process.env.UPLOAD_CARE_PRIVATE_KEY;
		if (!publicKey || !privateKey) {
			throw new Error('Invalid public key');
		}
		return {
			storage: new UploadCareStorage(publicKey, privateKey),
			encryption: new NullEncryption(),
			scanner: new NullScanner()
		}
	}
}
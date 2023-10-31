import fs from 'node:fs';
import path from 'node:path';


export interface File {
	body: Buffer;
	name: string;
	type: string;
	size: number;
}

export interface StorageDocument {
	name: string,
	body: Buffer
}

export interface Storage {
	upload: (document: StorageDocument) => Promise<string>;
	//download: (documentId: string) => Promise<StorageDocument>
}

export interface Scanner {
	scan: (file: File) => Promise<boolean>
}
export class NullScanner implements Scanner {
	public scan(): Promise<boolean> {
		return Promise.resolve(false);
	}
}

export interface Encryption {	
	encrypt: (userId: string, file: File) => Promise<File>
}

export class NullEncryption implements Encryption {
	public encrypt(_: string, file: File): Promise<File> {
		return Promise.resolve(file);
	}
}

export class LocalStorage implements Storage {
	public upload(document: StorageDocument): Promise<string> {
		return new Promise((resolve, reject) => {
			const filePath = path.join(process.cwd(), 'public', document.name);
			fs.writeFile(filePath, document.body, (err) => {
				if (err) {
					reject(err.message);
					return;
				}

				resolve(`/${document.name}`);
			});
		});
	}

	// public download(documentId: string): Promise<StorageDocument> {

	// }
}

export interface UploadFlowFactoryClasses {
	storage: Storage,
	encryption: Encryption,
	scanner: Scanner
}
export interface UploadFlowFactory {
	getClasses: () => UploadFlowFactoryClasses
}

export const testUploadFlowFactory: UploadFlowFactory = {
	getClasses: () => ({storage: new LocalStorage(), scanner: new NullScanner(), encryption: new NullEncryption()})
}
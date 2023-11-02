import AWS, { config } from "aws-sdk";
import type { Storage, StorageDocument } from "./storage";

export class AwsStorage implements Storage {
	private readonly s3: AWS.S3;

	public constructor(awsAccessKeyId: string, awsSecretAccessKey: string, private bucketName: string) {
		config.credentials = new AWS.Credentials(awsAccessKeyId, awsSecretAccessKey);
		this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
	}

	public async upload(document: StorageDocument): Promise<string> {
		const mainUpload = this.s3.upload({
			Bucket: this.bucketName,
			Key: document.name,
			Body: document.body
		});

		await mainUpload.promise();

		return document.name;
	}

	// public async download(documentId: string): Promise<StorageDocument> {
	// 	return new Promise((resolve, reject) => {
	// 		const request = {
	// 			Bucket: this.bucketName,
	// 			Key: documentId
	// 		}
	// 		this.s3.getObject(request, (err, data) => {
	// 			const body = data.Body;
	// 			if (body === undefined) {
	// 				reject(err);
	// 				return;
	// 			}

	// 			resolve({
	// 				id: documentId,
	// 				body
	// 			})
	// 		});
	// 	});
	// }
}
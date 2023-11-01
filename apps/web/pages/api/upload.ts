import type { Stream } from 'node:stream';
import type { IncomingMessage } from 'node:http';
import type { NextApiResponse, NextApiRequest } from "next";
import { testContainer } from "api/src/containers/inversify.test.config";
import { DocumentService } from "api/src/services/documents/document-service";
import busboy from 'busboy';

export interface File {
	body: Buffer;
	name: string;
	type: string;
	size: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.method === 'POST') {
		try {
			const documentService = testContainer.get<DocumentService>(DocumentService.$);
			
			const [fields, files] = await parseFormData(req);

			const patientId = fields.patientId;
			const file = files[0]
			await documentService.uploadDocument('', patientId, file)

			
		} catch(err) {
			res.status(500).json({message: `${err}`});
			return;
		}

		res.status(200).json({});
		return;
	}

	res.status(404).json({});
}

function parseFormData(req: IncomingMessage): Promise<[Record<string, string>, File[]]> {
	const bb = busboy({headers: req.headers});
	const fields: Record<string, string> = {};
	
	const promise = new Promise<[Record<string, string>, File[]]>((resolve, reject) => {
		const filesPromise: Promise<File>[] = [];

		bb.on('field', (name, val) => {
			fields[name] = val;
		})

		bb.on('file', (name, file, info) => {
			filesPromise.push(streamToFile(file, info));
		});

		bb.on('close', () => {
			Promise.all(filesPromise).then(files => {
				resolve([fields, files]);
			}).catch(err => {
				reject(err);
			})
		});
	});

	req.pipe(bb);

	return promise;
}

async function streamToFile(stream: Stream, info: {filename: string, mimeType: string}): Promise<File> {
	const {filename, mimeType} = info;
	const buffer = await streamToBuffer(stream);

	return {
		name: filename,
		type: mimeType,
		size: buffer.length,
		body: buffer
	}
}

async function streamToBuffer(stream: Stream): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
			
			const _buf: Uint8Array[] = [];

			stream.on("data", (chunk: Uint8Array) => _buf.push(chunk));
			stream.on("end", () => {
				resolve(Buffer.concat(_buf))
			});
			stream.on("error", err => {
				reject(new Error(`Error converting stream - ${err}`))
			});

	});
}

export const config = {
	api: {
		bodyParser: false
	}
}
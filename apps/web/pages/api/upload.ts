import type { Stream } from 'node:stream';
import type { NextApiResponse, NextApiRequest } from "next";
import { testContainer } from "api/src/containers/inversify.test.config";
import { DocumentService } from "api/src/services/documents/document-service";
import busboy from 'busboy';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
	if (req.method === 'POST') {
		try {
			const bb = busboy({headers: req.headers});
			const documentService = testContainer.get<DocumentService>(DocumentService.$);

			let patientId: string | undefined;
			let filename: string | undefined;
			let mimeType: string | undefined;

			bb.on('field', (name, val) => {
				if (name === 'patientId') {
					patientId = val;
				}
			})

			bb.on('file', (name, file, info) => {
				filename = info.filename;
				mimeType = info.mimeType;

				streamToBuffer(file).then(buffer => {
					if (patientId === undefined) {
						throw new Error('Invalid patient id value');
					}
					void documentService.uploadDocument('', patientId, {name: filename || '', type: mimeType || 'jpeg', body: buffer, size: buffer.length})
				}).catch((err: Error) => {
					throw err;
				});
			});	

			req.pipe(bb);
		} catch(err) {
			res.status(500).json({});
			return;
		}

		res.status(200).json({});
		return;
	}

	res.status(404).json({});
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
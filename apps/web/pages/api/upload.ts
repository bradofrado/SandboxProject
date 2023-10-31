import fs from 'node:fs';
import type { NextApiResponse, NextApiRequest } from "next";
import type formidable from 'formidable';
import {Formidable} from 'formidable';
import { testContainer } from "api/src/containers/inversify.test.config";
import { DocumentService } from "api/src/services/documents/document-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.method === 'POST') {
		try {
		const form = new Formidable({});
		const [fields, files] = await form.parse(req);

		if (fields.patientId === undefined) {
			res.status(400).json({message: 'Invalid body parameters'});
			return;
		}

		const [patientId] = fields.patientId;
		const theFiles = Object.values(files).map(file => file ? file[0] : undefined).filter(file => file !== undefined) as formidable.File[];
		
		const documentService = testContainer.get<DocumentService>(DocumentService.$);

		const file = theFiles[0];
		
		const buffer = fs.readFileSync(file.filepath);

		await documentService.uploadDocument('', patientId, {name: file.originalFilename || '', type: file.mimetype || 'jpeg', body: buffer, size: file.size})

		} catch(err) {
			res.status(500).json({});
			return;
		}

		res.status(200).json({});
		return;
	}

	res.status(404).json({});
	
	// return new NextResponse(undefined, {
	// 	status: 200
	// })
}

export const config = {
	api: {
		bodyParser: false
	}
}
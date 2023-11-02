import { getServerAuthSession } from 'api/src/auth';
import { testContainer } from 'api/src/containers/inversify.test.config';
import { DocumentService } from 'api/src/services/documents/document-service';
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.method === 'GET') {
		const session = await getServerAuthSession(req);
		if (session?.auth === null || session?.auth === undefined) {
			res.status(401);
			return;
		}

		const { id } = req.query
		if (typeof id !== 'string') {
			res.status(400).json({message: 'Invalid url'});
			return;
		}

		const documentService = testContainer.get<DocumentService>(DocumentService.$);
		const path = await documentService.getDocumentPrivatePath(id);
		
		
		const result = await fetch(path, {
			method: 'GET',
		})
		result.headers.forEach((value, key) => {
			res.setHeader(key, value);
		})
		res.send(Buffer.from(await result.arrayBuffer()));

		return;
	}
  
	res.status(404);
}
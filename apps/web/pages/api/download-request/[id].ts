import { getServerAuthSession } from "api/src/auth";
import { testContainer } from "api/src/containers/inversify.test.config";
import { DocumentRequestService } from "api/src/services/documents/document-request-service";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.method === 'GET') {
		const {id} = req.query;
		const session = await getServerAuthSession(req);
		if (session?.auth === null || session?.auth === undefined) {
			res.status(400);
			return;
		}
		if (typeof id !== 'string') {
			res.status(401);
			return;
		}
		const documentRequestService = testContainer.get<DocumentRequestService>(DocumentRequestService.$);
//'<CAMjAcROexvOOfMW-wou_4KDLNoGsXfpxg1KJzS_5r0GpbHkR4g@mail.gmail.com>'
		const attachments = await documentRequestService.downloadDocumentRequest(id, session.auth.userId, session.auth.user.email);
		res.status(200).send(attachments);
		return;
	}

	res.status(404).json({});
}
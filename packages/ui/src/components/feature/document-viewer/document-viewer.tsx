import { PDFViewer } from "./viewers/pdf-viewer"
import {DocumentType, DocumentViewerComponent} from './types';

export interface DocumentViewerProps {
	src: string,
	type: DocumentType
}
export const DocumentViewer: React.FunctionComponent<DocumentViewerProps> = ({src, type}) => {
	const Component = documentComponents[type];
	return (
		<div className="fixed top-0 left-0 w-full z-50 bg-gray-500/90">
			<Component src={src}/>
		</div>
	)
}

const documentComponents: Record<DocumentType, DocumentViewerComponent> = {
	'pdf': PDFViewer
}
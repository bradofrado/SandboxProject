import { ModalPortal } from "../../core/modal";
import { ClosableContent } from "../../core/closable-content";
import { PDFViewer } from "./viewers/pdf-viewer"
import type {DocumentType, DocumentViewerComponent} from './types';
import { ImageViewer } from "./viewers/img-viewer";

export interface DocumentViewerProps {
	src?: string,
	type?: DocumentType,
	show: boolean,
	onClose: () => void
}
export const DocumentViewer: React.FunctionComponent<DocumentViewerProps> = ({src, type, show, onClose}) => {
	if (show && (!src || !type)) throw new Error('Invalid src and type');
	const Component = type && src ? documentComponents[type] : undefined;
	return (
		<ModalPortal show={show}>
			<ClosableContent onClose={onClose}>
				{type && src && Component ? <Component src={src}/> : null}
			</ClosableContent>
		</ModalPortal>
	)
}

const documentComponents: Record<DocumentType, DocumentViewerComponent> = {
	'pdf': PDFViewer,
	'img': ImageViewer
}
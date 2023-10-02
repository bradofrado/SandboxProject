import { PDFViewer } from "./viewers/pdf-viewer"
import {DocumentType, DocumentViewerComponent} from './types';
import { ModalPortal } from "../../core/modal";
import { ClosableContent } from "../../core/closable-content";

export interface DocumentViewerProps {
	src: string,
	type: DocumentType,
	show: boolean,
	setShow: (show: boolean) => void
}
export const DocumentViewer: React.FunctionComponent<DocumentViewerProps> = ({src, type, show, setShow}) => {
	const Component = documentComponents[type];
	return (
		<ModalPortal show={show}>
			<ClosableContent onClose={() => {setShow(false)}}>
				<Component src={src}/>
			</ClosableContent>
		</ModalPortal>
	)
}

const documentComponents: Record<DocumentType, DocumentViewerComponent> = {
	'pdf': PDFViewer
}
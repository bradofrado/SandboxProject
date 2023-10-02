import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DocumentViewerComponent } from '../types';
import { PagedDocumentViewer } from '../paged-viewer';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const PDFViewer: DocumentViewerComponent = ({src}) => {
	const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <PagedDocumentViewer>
			{(page, setPage) => <>
				<Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
					<Page pageNumber={page} height={650} />
				</Document>
				<p>
					Page {page} of {numPages}
				</p>
			</>
			}
		</PagedDocumentViewer>
  ); 
}
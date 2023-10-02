import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../../core/icons";

export const PagedDocumentViewer: React.FunctionComponent<{children: (page: number, setPage: ((page: number) => void)) => React.ReactNode}> = ({children}) => {
	const [page, setPage] = useState(1);
	const [numPages, setNumPages] = useState<number>(0);

	const setThePage = (newPage: number): void => {
		if (newPage <= numPages && newPage >= 1) {
			setPage(newPage);
		}
	}

	return (
		<div className="flex gap-2 justify-center">
			<button onClick={() => {setThePage(page - 1)}} type="button">
				<ChevronLeftIcon className="w-5 h-5"/>
			</button>
			{children(page, setNumPages)}
			<button onClick={() => {setThePage(page + 1)}} type="button">
				<ChevronRightIcon className="w-5 h-5"/>
			</button>
		</div>
	)
}
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../../core/icons";

export const PagedDocumentViewer: React.FunctionComponent<{children: (page: number, setPage: ((page: number) => void)) => React.ReactNode}> = ({children}) => {
	const [page, setPage] = useState(1);

	return (
		<div className="flex gap-2 justify-center">
			<ChevronLeftIcon className="w-5 h-5"/>
			<div className="w-fit p-2">
				{children(page, setPage)}
			</div>
			<ChevronRightIcon className="w-5 h-5"/>
		</div>
	)
}
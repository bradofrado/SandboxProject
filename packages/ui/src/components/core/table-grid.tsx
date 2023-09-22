import { useState } from "react"
import { ChevronSwitch } from "./chevron-switch"

export interface TableGridColumn<T extends Record<string, string>> {
	id: keyof T,
	label: string
}
export interface TableGridProps<T extends Record<string, string>> {
	items: T[],
	columns: TableGridColumn<T>[]
}
export const TableGrid = <T extends Record<string, string>>({items, columns}: TableGridProps<T>): JSX.Element => {
	const [sortId, setSortId] = useState<keyof T | undefined>();
	const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

	const sortItems = (): T[] => {
		if (sortId) {
			return items.slice().sort((a, b) => {
				let first = a;
				let second = b;
				if (sortOrder === "DESC") {
					first = b;
					second = a;
				}

				return first[sortId].localeCompare(second[sortId]);
			})
		}

		return items;
	}

	const onSortClick = (id: keyof T): void => {
		const newSortOrder = sortId === undefined || sortOrder === "DESC" ? "ASC" : 'DESC';
		setSortId(id);
		setSortOrder(newSortOrder);
	}

	const sorted = sortItems();
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{columns.map(({label, id}) => <th className="px-6 py-3" key={label} scope="col">
							<ChevronSwitch label={label} onChange={() => {onSortClick(id)}} value={id === sortId && sortOrder === "ASC"}/>
						</th>)}
					</tr>
				</thead>
				<tbody>
					{sorted.map((item, i) => <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
						{columns.map(({id}) => <td className="px-6 py-4" key={id.toString()}>{item[id]}</td>)}
					</tr>)}
				</tbody>
			</table>
		</div>
	)
}
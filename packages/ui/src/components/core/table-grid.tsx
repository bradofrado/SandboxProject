import { useState } from "react"
import { ChevronSwitch } from "./chevron-switch"

export type TableGridItemValue = string | {compareKey: string, label: React.ReactNode}
export type TableGridItem<T extends Record<string, TableGridItemValue>> = T
export interface TableGridColumn<T extends Record<string, TableGridItemValue>> {
	id: keyof T,
	label: string
}
export interface TableGridProps<T extends Record<string, TableGridItemValue>> {
	items: TableGridItem<T>[],
	columns: TableGridColumn<T>[],
	linkKey?: keyof T
}
export const TableGrid = <T extends Record<string, TableGridItemValue>>({items, columns, linkKey}: TableGridProps<T>): JSX.Element => {
	const [sortId, setSortId] = useState<keyof T | undefined>();
	const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

	const getCompareKey = (item: TableGridItemValue): string => {
		if (typeof item === 'string') return item;

		return item.compareKey;
	}

	const getLabel = (item: TableGridItemValue): React.ReactNode => {
		if (typeof item === 'string') return item;

		return item.label;
	}

	const sortItems = (): TableGridItem<T>[] => {
		if (sortId) {
			return items.slice().sort((a, b) => {
				let first = a;
				let second = b;
				if (sortOrder === "DESC") {
					first = b;
					second = a;
				}

				return getCompareKey(first[sortId]).localeCompare(getCompareKey(second[sortId]));
			})
		}

		return items;
	}

	const onSortClick = (id: keyof T): void => {
		const newSortOrder = sortId === undefined || sortOrder === "DESC" ? "ASC" : 'DESC';
		setSortId(id);
		setSortOrder(newSortOrder);
	}

	const onRowClick = (item: T): void => {
		if (linkKey) {
			const linkKeyValue = item[linkKey];
			if (typeof linkKeyValue !== 'string') throw new Error('Link key value on item must be a string');
			window.location.href = `/${linkKeyValue}`;
		}
	}

	const wrapInLink = (item: T, node: React.ReactNode): React.ReactNode => {
		if (linkKey) {
			const linkKeyValue = item[linkKey];
			if (typeof linkKeyValue !== 'string') throw new Error('Link key value on item must be a string');
			return <a className="hover:bg-gray-100 cursor-pointer" href={linkKeyValue}>{node}</a>
		}

		return node;
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
					{sorted.map((item, i) => <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${linkKey ? 'hover:bg-gray-100 cursor-pointer' : ''}`} key={i} onClick={() => {onRowClick(item)}}>
						{columns.map(({id}) => <td className="px-6 py-4" key={id.toString()}>{getLabel(item[id])}</td>)}
					</tr>)}
				</tbody>
			</table>
		</div>
	)
}
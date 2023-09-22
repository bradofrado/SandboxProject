export interface TableGridColumn<T extends Record<string, string>> {
	id: keyof T,
	label: string
}
export interface TableGridProps<T extends Record<string, string>> {
	items: T[],
	columns: TableGridColumn<T>[]
}
export const TableGrid = <T extends Record<string, string>>({items, columns}: TableGridProps<T>): JSX.Element => {
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{columns.map(({label}) => <th className="px-6 py-3" key={label} scope="col">{label}</th>)}
					</tr>
				</thead>
				<tbody>
					{items.map((item, i) => <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>{columns.map(({id}) => <td className="px-6 py-4" key={id.toString()}>{item[id]}</td>)}</tr>)}
				</tbody>
			</table>
		</div>
	)
}
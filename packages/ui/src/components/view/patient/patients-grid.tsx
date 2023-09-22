import { Pill } from "../../core/pill";
import { type TableGridColumn, TableGrid } from "../../core/table-grid";

export interface PatientsGridProps {
	searchKey?: string
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- For some reason a type is needed here
type PatientGridItem = {
	id: string,
	lastName: string,
	firstName: string,
	lawFirm: string,
	primaryContact: string,
	lastUpdate: {compareKey: string, label: React.ReactNode},
	outstandingBalance: string
}
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({searchKey}) => {
	
	const columns: TableGridColumn<PatientGridItem>[] = [
		{
			id: 'lastName',
			label: 'Last Name',
		},
		{
			id: 'firstName',
			label: 'First Name',
		},
		{
			id: 'lawFirm',
			label: 'Law Firm',
		},
		{
			id: 'primaryContact',
			label: 'Primary Contact',
		},
		{
			id: 'lastUpdate',
			label: 'Last Update',
		},
		{
			id: 'outstandingBalance',
			label: 'Outstanding Balance',
		},
	]
	const itemss: PatientGridItem[] = [
		{
			id: 'patients/0',
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21In Legation', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			id: 'patients/0',
			firstName: 'Layne',
			lastName: 'Abbott',
			lawFirm: 'Good Guys Law',
			primaryContact: 'Clint Peterson',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$3,684.38'
		},
		{
			id: 'patients/0',
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			id: 'patients/0',
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			id: 'patients/0',
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/22', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
	]

	const filtered = filterItems(itemss, searchKey, (value) => (value as PatientGridItem['lastUpdate']).compareKey.toLowerCase());
    return (
		<TableGrid columns={columns} items={filtered} linkKey="id"/>
	)
}

const LastUpdateComponent: React.FunctionComponent<{date: string, statuses: string[]}> = ({date, statuses}) => {
	return (
		<div className="flex flex-col gap-1">
			<span>{date}</span>
			{statuses.map(status => <Pill className="w-fit" key={status}>{status}</Pill>)}
		</div>
	)
}

function filterItems<T extends Record<string, unknown>>(items: T[], filterKey: string | undefined, getCompareKey?: (value: unknown) => string): T[] {
	const _getCompareKey = (value: unknown): string => {
		if (typeof value === 'string') return value.toLowerCase();
		if (!getCompareKey) throw new Error('Must provide a compare key function for non strings');

		return getCompareKey(value);
	}
	const reduceItem = (item: T): string =>  Object.values(item).reduce<string>((prev, curr) => prev + _getCompareKey(curr), '')

	return items.filter(item => reduceItem(item).includes((filterKey || '').toLowerCase()));
}
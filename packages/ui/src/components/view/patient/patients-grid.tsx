import type { Patient } from "model/src/patient";
import {displayDate, formatDollarAmount} from 'model/src/utils';
import { Pill } from "../../core/pill";
import { type TableGridColumn, TableGrid } from "../../core/table-grid";

export interface PatientsGridProps {
	searchKey?: string,
	patients: Patient[]
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
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({searchKey, patients}) => {
	
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
	const items: PatientGridItem[] = patients.map(({id, lastName, firstName, lawFirm, primaryContact, lastUpdateDate, outstandingBalance, statuses}) => ({
		id: `patients/${id}`, lastName, firstName, lawFirm, primaryContact,
		lastUpdate: {compareKey: lastUpdateDate ? `${displayDate(lastUpdateDate)}${statuses.join('')}` : '---', label: <LastUpdateComponent date={lastUpdateDate} statuses={statuses}/>},
		outstandingBalance: formatDollarAmount(outstandingBalance)
	}))

	const filtered = filterItems(items, searchKey, (value) => (value as PatientGridItem['lastUpdate']).compareKey.toLowerCase());
    return (
		<TableGrid columns={columns} items={filtered} itemsPerPage={12} linkKey="id"/>
	)
}

const LastUpdateComponent: React.FunctionComponent<{date: Date | null, statuses: string[]}> = ({date, statuses}) => {
	return date ? (
		<div className="flex flex-col gap-1">
			<span>{displayDate(date)}</span>
			{statuses.map(status => <Pill className="w-fit" key={status}>{status}</Pill>)}
		</div>
	) : <span>---</span>
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
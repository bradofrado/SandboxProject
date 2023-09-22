import { type NextPage} from 'next';
import type { SidePanelItems} from 'ui/src/components/core/side-panel';
import {useGetPatients} from 'ui/src/services/patient';
import {TableGrid, type TableGridColumn} from 'ui/src/components/core/table-grid'
import {Header} from 'ui/src/components/core/header';
import {Input} from 'ui/src/components/core/input';
import {Pill} from 'ui/src/components/core/pill';
import { useState } from 'react';

const Patients: NextPage = () => {
    const query = useGetPatients();
	const [searchKey, setSearchKey] = useState('');
    if (query.isLoading || query.isError) {
        return <>Loading...</>
    }
    const patients = query.data;

    const items: SidePanelItems[] = patients.map(patient => ({label: patient.name, href: {query: {id: patient.id}}}))
	const columns: TableGridColumn<{lastName: string, firstName: string, lawFirm: string, primaryContact: string, lastUpdate: {compareKey: string, label: React.ReactNode}, outstandingBalance: string}>[] = [
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
	const itemss = [
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Layne',
			lastName: 'Abbott',
			lawFirm: 'Good Guys Law',
			primaryContact: 'Clint Peterson',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$3,684.38'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/21', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: {compareKey: '8/7/22', label: <LastUpdateComponent date='8/7/22' statuses={['In Legation']}/>},
			outstandingBalance: '$1,941.69'
		},
	]

	const filtered = filterItems(itemss, searchKey, (value: {compareKey: string}) => value.compareKey.toLowerCase());
    return (
		<div>
			<div className="flex justify-between items-center p-2">
				<Header level={2}>Patients</Header>
				<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
			</div>
			<TableGrid columns={columns} items={filtered}/>
		</div>
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

function filterItems<T extends Record<string, unknown>>(items: T[], filterKey: string, getCompareKey?: (value: unknown) => string): T[] {
	const _getCompareKey = (value: unknown): string => {
		if (typeof value === 'string') return value.toLowerCase();
		if (!getCompareKey) throw new Error('Must provide a compare key function for non strings');

		return getCompareKey(value);
	}
	const reduceItem = (item: T): string =>  Object.values(item).reduce<string>((prev, curr) => prev + _getCompareKey(curr), '')

	return items.filter(item => reduceItem(item).includes(filterKey));
}

export default Patients;
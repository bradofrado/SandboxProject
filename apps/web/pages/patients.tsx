import { type NextPage} from 'next';
import type { SidePanelItems} from 'ui/src/components/core/side-panel';
import {useGetPatients} from 'ui/src/services/patient';
import {TableGrid, type TableGridColumn} from 'ui/src/components/core/table-grid'
import {Header} from 'ui/src/components/core/header';
import {Input} from 'ui/src/components/core/input';
import { useState } from 'react';

const Patients: NextPage = () => {
    const query = useGetPatients();
	const [searchKey, setSearchKey] = useState('');
    if (query.isLoading || query.isError) {
        return <>Loading...</>
    }
    const patients = query.data;

    const items: SidePanelItems[] = patients.map(patient => ({label: patient.name, href: {query: {id: patient.id}}}))
	const columns: TableGridColumn<{lastName: string, firstName: string, lawFirm: string, primaryContact: string, lastUpdate: string, outstandingBalance: string}>[] = [
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
			lastUpdate: '8/7/21',
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Layne',
			lastName: 'Abbott',
			lawFirm: 'Good Guys Law',
			primaryContact: 'Clint Peterson',
			lastUpdate: '9/2/23',
			outstandingBalance: '$3,684.38'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: '8/7/21',
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: '8/7/21',
			outstandingBalance: '$1,941.69'
		},
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: '8/7/21',
			outstandingBalance: '$1,941.69'
		},
	]

	const filtered = filterItems(itemss, searchKey);
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

function filterItems<T extends Record<string, string>>(items: T[], filterKey: string): T[] {
	const reduceItem = (item: T): string =>  Object.values(item).reduce<string>((prev, curr) => prev + curr.toLowerCase(), '')

	return items.filter(item => reduceItem(item).includes(filterKey));
}

export default Patients;
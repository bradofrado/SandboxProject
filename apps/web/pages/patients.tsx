import { type NextPage} from 'next';
import { useRouter } from 'next/router';
import type { SidePanelItems} from 'ui/src/components/core/side-panel';
import {useGetPatients} from 'ui/src/services/patient';
import {TableGrid, TableGridColumn} from 'ui/src/components/core/table-grid'

const Patients: NextPage = () => {
    const router = useRouter();
    const query = useGetPatients();
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
		{
			firstName: 'Maria',
			lastName: 'Abarca',
			lawFirm: 'Siegfried and Jensen',
			primaryContact: 'Jeremy Richards',
			lastUpdate: '8/7/21',
			outstandingBalance: '$1,941.69'
		},
	]
    return (
        // <SidePanel items={items} path={router.asPath}>
        //     {typeof router.query.id === 'string' && <div className="p-8">
        //         <PatientViewId id={router.query.id}/>
        //     </div>}
        // </SidePanel>
		<TableGrid columns={columns} items={itemss}/>
	)
}

export default Patients;
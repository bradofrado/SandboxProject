import { type NextPage} from 'next';
import { useState } from 'react';
import { Header } from 'ui/src/components/core/header';
import { Input } from 'ui/src/components/core/input';
import {PatientsGrid} from 'ui/src/components/view/patient/patients-grid'
import {useGetPatients} from 'ui/src/services/patient';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';
import { Layout } from '../util/components/layout';
import { DropdownList, ListItem } from 'ui/src/components/core/dropdown';

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
	const query = useGetPatients();
	const [searchKey, setSearchKey] = useState('');
	const [filterColumns, setFilterColumns] = useState<ListItem[]>([{label: 'Date of Loss', value: false}, {label: 'Last Update', value: false}, {label: 'By Attorney', value: false}])
	
	if (query.isError || query.isLoading) return <>Loading</>

	const items = query.data;
    
    return (
			<Layout>
				<div className="flex flex-col gap-2 p-2">
					<Header level={2}>Patients</Header>
					<div className="flex w-fit gap-2">
						<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
						<FilterButton items={filterColumns} onChange={setFilterColumns}/>
					</div>
					<PatientsGrid patients={items}/>
				</div>
			</Layout>
		)
}

interface FilterButtonProps {
	items: ListItem[],
	onChange: (items: ListItem[]) => void
}
const FilterButton: React.FunctionComponent<FilterButtonProps> = ({items, onChange}) => {
	return (
		<DropdownList items={items} setItems={onChange}>
			Filters
		</DropdownList>
	)
}

export default Patients;
import { type NextPage} from 'next';
import { useState } from 'react';
import { Header } from 'ui/src/components/core/header';
import { Input } from 'ui/src/components/core/input';
import {PatientsGrid} from 'ui/src/components/view/patient/patients-grid'
import {useGetPatients} from 'ui/src/services/patient';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';
import { Layout } from '../util/components/layout';

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
	const [searchKey, setSearchKey] = useState('');
	const query = useGetPatients();
	if (query.isError || query.isLoading) return <>Loading</>

	const items = query.data;
    
    return (
			<Layout>
				<div className="flex justify-between items-center p-2">
					<Header level={2}>Patients</Header>
					<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
				</div>
				<PatientsGrid patients={items} searchKey={searchKey}/>
			</Layout>
		)
}

export default Patients;
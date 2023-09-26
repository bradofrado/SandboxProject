import { type NextPage} from 'next';
import { Header } from 'ui/src/components/core/header';
import {PatientsGrid} from 'ui/src/components/view/patient/patients-grid'
import {useGetPatients} from 'ui/src/services/patient';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';
import { Layout } from '../util/components/layout';

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
	const query = useGetPatients();
	
	if (query.isError || query.isLoading) return <>Loading</>

	const items = query.data;
    
	return (
		<Layout>
			<div className="flex flex-col gap-2 p-2">
				<Header level={2}>Patients</Header>
				<PatientsGrid patients={items} />
			</div>
		</Layout>
	)
}



export default Patients;
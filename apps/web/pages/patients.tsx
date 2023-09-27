import { type NextPage} from 'next';
import {useGetPatients} from 'ui/src/services/patient';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';
import { Layout } from '../util/components/layout';
import { PatientView } from '../util/components/patient-view';

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
	const query = useGetPatients();
	
	if (query.isError || query.isLoading) return <>Loading</>

	const items = query.data;
    
	return (
		<Layout>
			<PatientView items={items} />
		</Layout>
	)
}




export default Patients;
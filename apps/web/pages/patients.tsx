import { type NextPage} from 'next';
import { useRouter } from 'next/router';
import type { SidePanelItems} from 'ui/src/components/core/side-panel';
import { SidePanel } from 'ui/src/components/core/side-panel';
import {useGetPatients} from 'ui/src/services/patient';
import {PatientViewId} from 'ui/src/components/view/patient/patient-view';


const Patients: NextPage = () => {
    const router = useRouter();
    const query = useGetPatients();
    if (query.isLoading || query.isError) {
        return <>Loading...</>
    }
    const patients = query.data;

    const items: SidePanelItems[] = patients.map(patient => ({label: patient.name, href: {query: {id: patient.id}}}))

    return (
        <SidePanel items={items} path={router.asPath}>
            {typeof router.query.id === 'string' && <div className="p-8">
                <PatientViewId id={router.query.id}/>
            </div>}
        </SidePanel>
	)
}

export default Patients;
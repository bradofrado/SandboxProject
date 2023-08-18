import { type NextPage} from 'next';
import { useRouter } from 'next/router';
import { SidePanel, type SidePanelItems } from '~/utils/components/base/side-panel';
import { PatientDisplayId } from '~/utils/components/patients/patient-display';
import { useGetPatients } from '~/utils/services/patient';


const Patients: NextPage = () => {
    const router = useRouter();
    const query = useGetPatients();
    if (query.isLoading || query.isError) {
        return <>Loading...</>
    }
    const patients = query.data;

    const items: SidePanelItems[] = patients.map(patient => ({label: patient.name, href: {query: {id: patient.id}}}))

    return <>
        <SidePanel items={items}>
            {typeof router.query.id == 'string' && <div className="p-8">
                <PatientDisplayId id={router.query.id}/>
            </div>}
        </SidePanel>
    </>
}

export default Patients;
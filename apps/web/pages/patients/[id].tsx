import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SidePanel, type SidePanelItems } from "ui/src/components/core/side-panel";
import { PatientViewId } from 'ui/src/components/view/patient/patient-view'
import { useGetPatients } from "ui/src/services/patient";
import { Layout } from "../../util/components/layout";

const PatientPage: NextPage = () => {
	const router = useRouter();
	const query = useGetPatients();
	const patients = query.data;
	
	const items: SidePanelItems[] = patients.map(patient => ({label: `${patient.firstName} ${patient.lastName}`, href: {pathname: `/patients/${patient.id}`}}))

    return (
			<Layout>
        <SidePanel items={items} path={router.asPath}>
					{typeof router.query.id === 'string' ? <div className="p-8">
						<PatientViewId id={router.query.id}/>
					</div> : null}
        </SidePanel>
			</Layout>
	)
}

export default PatientPage;
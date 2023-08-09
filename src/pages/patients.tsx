import {type GetStaticProps, type NextPage} from 'next';
import { useRouter } from 'next/router';
import Header from '~/utils/components/base/header';
import { SidePanel, type SidePanelItems } from '~/utils/components/base/side-panel';

export const getStaticProps: GetStaticProps = () => {
    return {props: {}}
}

interface Patient {
    name: string,
    id: string
}

const patients: Patient[] = [
    {
        name: 'Bob',
        id: '1',
    },
    {
        name: 'Jennifer',
        id: '2'
    }
]

const Patients: NextPage = () => {
    const router = useRouter();
    const items: SidePanelItems[] = patients.map(patient => ({label: patient.name, href: {query: {id: patient.id}}}))

    const active = patients.find(x => router.query.id == x.id);
    return <>
        <SidePanel items={items}>
            {active && <Header>Hello {active.name}</Header>}
        </SidePanel>
    </>
}

export default Patients;
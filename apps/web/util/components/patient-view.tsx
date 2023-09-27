import type { Patient } from "model/src/patient";
import { Header } from "ui/src/components/core/header";
import { PatientViewId } from "ui/src/components/view/patient/patient-view";
import { PatientsGrid } from "ui/src/components/view/patient/patients-grid";
import { ClosableContent } from 'ui/src/components/core/closable-content';
import { useRouter } from "next/router";
import { Card } from "ui/src/components/core/card";

export interface PatientViewProps {
	id?: string,
	items: Patient[]
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({id, items}) => {
	const router = useRouter();
	const onPatientClick = (_id: string | undefined): void => {
		void router.push(_id !== undefined ? `/patients/${_id}` : '/patients', undefined, {shallow: true});
	}
	return (
		<div className="flex flex-col gap-2 p-2">
			<Header level={2}>Patients</Header>
			<PatientsGrid collapse={id !== undefined} onPatientClick={onPatientClick} patients={items}>
				<ClosableContent onClose={() => {onPatientClick(undefined)}}>
					{id ? <PatientViewId id={id}/> : null}
				</ClosableContent>
			</PatientsGrid>
		</div>
	)
}
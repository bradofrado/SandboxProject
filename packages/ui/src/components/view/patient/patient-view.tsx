import { type Patient} from 'model/src/patient'
import { displayDate } from "model/src/utils";
import { Header } from "../../core/header";
import { Label } from "../../core/label";
import { Pill } from "../../core/pill";
import { type TabItem, TabControl } from "../../core/tab";
import { useGetPatient } from "../../../services/patient";
import { Card } from "../../core/card";
import { Button } from "../../core/button";
import { StatusTab } from "./tabs/status-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { FinanceTab } from "./tabs/finance-tab";

export interface PatientViewProps {
  patient: Patient
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({patient}) => {
	const tabItems: TabItem[] = [
		{
			id: 0,
			label: 'Status',
			component: <StatusTab patient={patient}/>
		},
		{
			id: 1,
			label: 'Documents',
			component: <DocumentsTab patient={patient}/>
		},
		{
			id: 2,
			label: 'Finance',
			component: <FinanceTab patient={patient}/>
		},
	]

    return (
      <div className="flex flex-col gap-8 flex-wrap">
				<div className="flex gap-4">
					<PatientBio patient={patient}/>
				</div>
				<TabControl items={tabItems}/>
      </div>
	)
}

const PatientBio: React.FunctionComponent<{patient: Patient}> = ({patient}) => {
	return (
		<Card>
			<div className="flex flex-col gap-4">
				<div className="flex gap-16 items-center">
					<Header>{patient.firstName} {patient.lastName}</Header>
					<div className="flex flex-col gap-1">
						{patient.statuses.map(status => <Pill className="w-fit" key={status}>{status}</Pill>)}
					</div>
				</div>
				<div className="flex gap-8">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<Label label="DOB" sameLine>
								{displayDate(patient.dateOfBirth)}
							</Label>
							<Label label="DOL" sameLine>
								{displayDate(patient.dateOfLoss)}
							</Label>
						</div>
						<Label label="Law Firm" sameLine>
							{patient.lawFirm}
						</Label>
						<Label label="Incident Type" sameLine>
							{patient.incidentType}
						</Label>
					</div>
					<div className="flex flex-col gap-2">
						<Label label="Email" sameLine>
							{patient.email}
						</Label>
						<Label label="Phone" sameLine>
							{patient.phone}
						</Label>
						<Button className="ml-auto">Message</Button>
					</div>
				</div>
			</div>
		</Card>
	)
}

export const PatientViewId: React.FunctionComponent<{id: string}> = ({id}) => {
    const query = useGetPatient(id);
    if (query.isLoading || query.isError) {
      return <>Loading</>
    }
    const patient = query.data;
    if (!patient) {
      return <Header>Invalid Patient</Header>
    }

    return (
      <PatientView key={patient.id} patient={patient}/>
		);
}
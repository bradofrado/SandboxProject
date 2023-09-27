import { useState } from "react";
import dayjs from 'dayjs';
import { type Patient} from 'model/src/patient'
import { displayDate } from "model/src/utils";
import { useSubscriber } from "../../../hooks/subscriber";
import { Attachment } from "../../core/attachment";
import { Calendar } from "../../core/date-picker";
import { Header } from "../../core/header";
import { Label } from "../../core/label";
import { Pill } from "../../core/pill";
import { type TabItem, TabControl } from "../../core/tab";
import { ChatBox } from "../../feature/chat/chat-box";
import { useGetPatient } from "../../../services/patient";
import { Card } from "../../core/card";
import { EditableText } from "../../feature/edit/editable-text";
import { Button } from "../../core/button";
import { StatusTracker } from "../../feature/status-tracker";
import { StatusTab } from "./tabs/status-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { FinanceTab } from "./tabs/finance-tab";

export interface PatientViewProps {
    patient: Patient
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({patient}) => {
	const [notes, setNotes] = useState(patient.notes);
	const {subscriber, emit} = useSubscriber();

	const onNotesSave = (value: string): void => {
		setNotes(value);
	}

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
			component: <FinanceTab/>
		},
		{
			id: 3,
			label: 'Message',
			component: <div>
				<Card label="Messages">
					<ChatBox user={{id: '0', name: 'Bob', image: '/braydon.jpeg'}} />
				</Card>
			</div>
		},
	]

    return (
      <div className="flex flex-col gap-8 flex-wrap">
				<div className="flex gap-4">
					<Card className="max-w-lg">
						<div className="flex flex-col gap-4">
							<div className="flex gap-16 items-center">
								<Header>{patient.firstName} {patient.lastName}</Header>
								<div className="flex flex-col gap-1">
									{patient.statuses.map(status => <Pill className="w-fit" key={status}>{status}</Pill>)}
								</div>
							</div>
							<div className="flex gap-4">
								<div className="flex flex-col gap-2">
									<Label label="Date of Birth" sameLine>
										{displayDate(patient.dateOfBirth)}
									</Label>
									<Label label="Date of Loss" sameLine>
										{displayDate(patient.dateOfLoss)}
									</Label>
									<Label label="Law Firm" sameLine>
										{patient.lawFirm}
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
					<Card className="min-w-[300px]" items={[{name: 'Edit', id: 'edit'}]} label="Notes" onChange={() => emit()}>
						<EditableText onChange={onNotesSave} subscriber={subscriber} text={notes}/>
					</Card>
				</div>
				<TabControl items={tabItems}/>
      </div>
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
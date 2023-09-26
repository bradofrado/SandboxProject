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

export interface PatientViewProps {
    patient: Patient
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({patient}) => {
	const [notes, setNotes] = useState(patient.notes);
	const {subscriber, emit} = useSubscriber();

	const onNotesSave = (value: string): void => {
		setNotes(value);
	}

	const statuses = ['File Setup', 'Treatment', 'Demand', 'Negotiation', 'Settlement']

	const tabItems: TabItem[] = [
		{
			id: 0,
			label: 'Status',
			component: (
				<div className="flex flex-col gap-4 py-2">
					<StatusTracker className="h-20" statuses={statuses} value="Treatment"/>
					<Card className="mt-5">
						<div className="flex gap-4">
							<Calendar value={new Date()}/>
							<Label label="Apointments">
								<ul>
									{patient.appointments.map((appointment, i) => {
										const day = dayjs(appointment);
										return <li key={i}>
											<div className="rounded-lg hover:bg-primary-light py-1 px-2">
												<Label label={day.format('ddd, MMM DD')} sameLine>
													{day.format('hh:mm a')}
												</Label>
											</div>
										</li>
									})}
								</ul>
							</Label>
						</div>
				</Card>
				<Card label="Documents">
						<Attachment label="Birth Certificate" link=""/>
				</Card>
			</div>
			)
		},
		{
			id: 1,
			label: 'Message',
			component: <div>
				<Card label="Messages">
					<ChatBox user={{id: '0', name: 'Bob', image: '/braydon.jpeg'}} />
				</Card>
			</div>
		}
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
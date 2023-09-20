import { useState } from "react";
import { useSubscriber } from "../../../hooks/subscriber";
import { Attachment } from "../../core/attachment";
import { Calendar } from "../../core/date-picker";
import { Header } from "../../core/header";
import { Label } from "../../core/label";
import { Pill } from "../../core/pill";
import { TabItem, TabControl } from "../../core/tab";
import { ChatBox } from "../../feature/chat/chat-box";
import { ProfileImage } from "../../feature/profile/profile-image";
import {Patient} from 'model/src/patient'
import dayjs from 'dayjs';
import { useGetPatient } from "../../../services/patient";
import { Card } from "../../core/card";
import { EditableText } from "../../feature/edit/editable-text";

export interface PatientViewProps {
    patient: Patient
}
export const PatientView = ({patient}: PatientViewProps) => {
    const [notes, setNotes] = useState(patient.notes);
    const {subscriber, emit} = useSubscriber();


    const displayDate = (date: Date) => {
        return dayjs(date).format('MM/DD/YY');
    }
    

    const onNotesSave = (value: string) => {
        setNotes(value);
    }

	const tabItems: TabItem[] = [
		{
			id: 0,
			label: 'Personal',
			component: <div className="flex flex-col gap-4">
				<Card className="max-w-lg">
                    <div className="flex flex-col gap-4">
                        <ProfileImage className='w-28 h-28' image="/braydon.jpeg"/>
                        <div className="flex gap-16 items-center">
                            <Header>{patient.name}</Header>
                            <Pill>{patient.status}</Pill>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label label="Date of Birth" sameLine>
                                {displayDate(patient.dateOfBirth)}
                            </Label>
                            <Label label="Date of Loss" sameLine>
                                {displayDate(patient.dateOfLoss)}
                            </Label>
                        </div>
                    </div>
                </Card>
                <Card label="Notes" items={[{name: 'Edit', id: 'edit'}]} onChange={() => emit()}>
                    <EditableText text={notes} subscriber={subscriber} onChange={onNotesSave}></EditableText>
                </Card>
			</div>
		},
		{
			id: 1,
			label: 'Other',
			component: <div className="flex flex-col gap-4">
				<Card>
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
                <Card label="Messages">
                    <ChatBox user={{id: '0', name: 'Bob', image: '/braydon.jpeg'}} />
                </Card>
			</div>
		}
	]

    return <>
        <div className="flex gap-8 flex-wrap">
			<TabControl items={tabItems}/>
        </div>
    </>
}

export const PatientViewId = ({id}: {id: string}) => {
    const query = useGetPatient(id);
    if (query.isLoading || query.isError) {
        return <></>
    }
    const patient = query.data;
    if (!patient) {
        return <Header>Invalid Patient</Header>
    }

    return <>
        <PatientView patient={patient} key={patient.id}/>
    </>
}
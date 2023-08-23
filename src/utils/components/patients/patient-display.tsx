import { type Patient } from "~/utils/types/patient"
import { ProfileImage } from "../profile/profile-image"
import Header from "../base/header"
import { Pill } from "../base/pill"
import { useGetPatient } from "~/utils/services/patient";
import { Calendar } from '~/utils/components/base/date-picker';
import dayjs from "dayjs";
import { Attachment } from "../base/attachment";
import { Card } from "../base/card";
import {EditableText} from '~/utils/components/edit/editable-text';
import { useState } from "react";
import { useSubscriber } from "~/utils/hooks/useSubscriber";
import Label from "../base/label";
import { ChatBox } from "../chat/chat-box";

export type PatientDisplayProps = {
    patient: Patient
}
export const PatientDisplay = ({patient}: PatientDisplayProps) => {
    const [notes, setNotes] = useState(patient.notes);
    const {subscriber, emit} = useSubscriber();


    const displayDate = (date: Date) => {
        return dayjs(date).format('MM/DD/YY');
    }
    

    const onNotesSave = (value: string) => {
        setNotes(value);
    }

    return <>
        <div className="flex gap-8 flex-wrap">
            <div className="flex flex-col gap-4">
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
            <div className="flex flex-col gap-4">
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
                    <ChatBox user={{id: '0'}} />
                </Card>
            </div>
        </div>
    </>
}

export const PatientDisplayId = ({id}: {id: string}) => {
    const query = useGetPatient(id);
    if (query.isLoading || query.isError) {
        return <></>
    }
    const patient = query.data;
    if (!patient) {
        return <Header>Invalid Patient</Header>
    }

    return <>
        <PatientDisplay patient={patient} key={patient.id}/>
    </>
}
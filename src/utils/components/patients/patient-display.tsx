import { type Patient } from "~/utils/types/patient"
import { ProfileImage } from "../profile/profile-image"
import Header from "../base/header"
import { Pill } from "../base/pill"
import { useGetPatient } from "~/utils/services/patient";
import { RangeCalendar } from '~/utils/components/base/date-picker';
import dayjs from "dayjs";
import Input from "../base/input";
import Label from "../base/label";
import { Attachment } from "../base/attachment";
import { Card } from "../base/card";

export type PatientDisplayProps = {
    patient: Patient
}
export const PatientDisplay = ({patient}: PatientDisplayProps) => {
    const displayDate = (date: Date) => {
        return dayjs(date).format('MM/DD/YY');
    }
    return <>
        <div className="inline-flex flex-col gap-8 flex-wrap max-h-screen">
            <Card className="max-w-lg" items={[{name: 'Edit', id: 'edit'}]} onChange={() => undefined}>
                <div className="flex flex-col gap-4">
                    <ProfileImage className='w-28 h-28' image="/braydon.jpeg"/>
                    <div className="flex gap-16 items-center">
                        <Header>{patient.name}</Header>
                        <Pill>In Legation</Pill>
                    </div>
                    <div className="text-sm">DOB: {displayDate(patient.dateOfBirth)} | DOL: {displayDate(patient.dateOfLoss)}</div>
                </div>
            </Card>
            <Card label="Notes">
                <p>Hello there this is notes</p>
            </Card>
            <Card>
                <RangeCalendar/>
            </Card>
            
            <Card label="Documents">
                <Attachment label="Birth Certificate" link=""/>
            </Card>
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
        <PatientDisplay patient={patient}/>
    </>
}
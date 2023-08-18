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

export type PatientDisplayProps = {
    patient: Patient
}
export const PatientDisplay = ({patient}: PatientDisplayProps) => {
    const displayDate = (date: Date) => {
        return dayjs(date).format('MM/DD/YY');
    }
    return <>
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <ProfileImage className='w-10 h-10' image={undefined}/>
                <Header>{patient.name}</Header>
                <Pill>In Legation</Pill>
            </div>
            <div>
                <span>DOB: {displayDate(patient.dateOfBirth)} | DOL: {displayDate(patient.dateOfLoss)}</span>
            </div>
            <div>
                <RangeCalendar/>
            </div>
            <div>
                <Input className="w-full" label="Notes" type='textarea'/>
            </div>
            <div>
                <Label label="Documents">
                    <Attachment label="Birth Certificate" link=""/>
                </Label>
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
        <PatientDisplay patient={patient}/>
    </>
}
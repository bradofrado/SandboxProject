import { patientStatuses, type Patient } from "model/src/patient";
import { StatusTracker } from "ui/src/components/feature/status-tracker";
import { displayDate } from "model/src/utils";
import { useGetPatientStatus } from "../../../services/patient";

export interface StatusTabProps {
  patient: Patient;
}
export const StatusTab: React.FunctionComponent<StatusTabProps> = ({
  patient,
}) => {
  const query = useGetPatientStatus(patient.id);
  if (query.isError || query.isLoading) return <>Loading</>;

  const appointments = query.data;
  
  return (
    <div className="flex flex-col gap-4 py-2">
      {patient.primaryContact ? <StatusTracker
        className="px-2"
        statuses={patientStatuses}
        value={patient.status}
      /> : null}
      <div className="flex gap-4">
        <ul>
          {appointments.map((appointment) => {
            //const day = dayjs(appointment.date);
            return (
              <li key={appointment.date.toString()}>
                <div className="flex gap-2 rounded-lg py-1 px-2">
                  {/* <Label label={day.format("ddd, MMM DD")} sameLine>
                    {day.format("hh:mm a")}
                  </Label> */}
									<span className="font-medium">{displayDate(appointment.date)}</span>
                  <div>{appointment.note}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

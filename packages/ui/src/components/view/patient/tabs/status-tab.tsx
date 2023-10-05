import { patientStatuses, type Patient } from "model/src/patient";
import { displayDate } from "model/src/utils";
import { useGetPatientStatus } from "../../../../services/patient";
import { StatusTracker } from "../../../feature/status-tracker";

export interface StatusTabProps {
  patient: Patient;
}
export const StatusTab: React.FunctionComponent<StatusTabProps> = ({
  patient,
}) => {
  const query = useGetPatientStatus(patient.id);
  if (query.isError || query.isLoading) return <>Loading</>;

  const status = query.data;
  if (!status) return <>There was an error</>;

  return (
    <div className="flex flex-col gap-4 py-2">
      <StatusTracker
        className="h-20 justify-center"
        statuses={patientStatuses}
        value={status.status}
      />
      <div className="flex gap-4">
        <ul>
          {status.appointments.map((appointment, i) => {
            //const day = dayjs(appointment.date);
            return (
              <li key={i}>
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

import { patientStatuses, type Patient } from "model/src/patient";
import { StatusTracker } from "ui/src/components/feature/status-tracker";
import {FeedTree} from 'ui/src/components/feature/feed-tree'
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
    <div className="flex flex-col gap-4 py-2 pr-2">
      {patient.primaryContact ? <StatusTracker
        className="px-2 pb-2"
        statuses={patientStatuses}
        value={patient.status}
      /> : null}
      <FeedTree items={appointments}/>
    </div>
  );
};

import { patientStatuses, type Patient } from "model/src/patient";
import { StatusTracker } from "ui/src/components/feature/status-tracker";
import {FeedTree} from 'ui/src/components/feature/feed-tree'
import { useGetPatientStatus, usePatientStatusComment } from "../../../services/patient";

export interface StatusTabProps {
  patient: Patient;
}
export const StatusTab: React.FunctionComponent<StatusTabProps> = ({
  patient,
}) => {
  const query = useGetPatientStatus(patient.id);
	const {mutate} = usePatientStatusComment();
  //if (query.isError || query.isLoading || patientCommentUtils.isLoading || patientCommentUtils.isError) return <>Loading</>;

  const appointments = query.data || [];

	const onComment = (comment: string): void => {
		mutate(comment, patient.id);
		//TODO: Get rid of delay
	}
  
  return (
    <div className="flex flex-col gap-4 py-2 pr-2">
      {patient.primaryContact ? <StatusTracker
        className="px-2 pb-2"
        statuses={patientStatuses}
        value={patient.status}
      /> : null}
      <FeedTree items={appointments} onComment={onComment}/>
    </div>
  );
};

import { type Patient } from "model/src/patient";
import { displayDate } from "model/src/utils";
import { useGetPatient } from "../../../services/patient";
import { Button } from "../../core/button";
import { Header } from "../../core/header";
import { Label } from "../../core/label";
import { Pill } from "../../core/pill";
import { TabControl, type TabItem } from "../../core/tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { FinanceTab } from "./tabs/finance-tab";
import { StatusTab } from "./tabs/status-tab";
import { ChatBox } from "../../feature/chat/chat-box";

export interface PatientViewProps {
  patient: Patient;
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({
  patient,
}) => {
  return (
		<div className="flex">
			<div className="border-x overflow-auto flex-1 min-w-[550px]"> {/* min-w-[550px] */}
				<PatientInfo patient={patient}/>
			</div>
			<div className="flex max-w-[600px] flex-col px-2">
				<Header level={2}>Thread</Header>
				<ChatBox chatId={patient.id} className="h-[80vh]" user={{id: '0', patientId: patient.id, name: patient.primaryContact, image: '/braydon.jpeg'}}/>
			</div>
		</div>

	)
};

const PatientInfo: React.FunctionComponent<{patient: Patient}> = ({patient}) => {
	const tabItems: TabItem[] = [
    {
      id: 0,
      label: "Status",
      component: <StatusTab patient={patient} />,
    },
    {
      id: 1,
      label: "Documents",
      component: <DocumentsTab patient={patient} />,
    },
    {
      id: 2,
      label: "Finance",
      component: <FinanceTab patient={patient} />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 flex-wrap">
      <div className="flex gap-4 px-2 pt-2">
        <PatientBio patient={patient} />
      </div>
      <TabControl items={tabItems} />
    </div>
  );
}

const PatientBio: React.FunctionComponent<{ patient: Patient }> = ({
  patient,
}) => {
  return (
    // <Card>
      <div className="flex flex-col gap-4">
        <div className="flex gap-16 items-center">
          <Header>
            {patient.firstName} {patient.lastName}
          </Header>
          <div className="flex flex-col gap-1">
            {patient.statuses.map((status) => (
              <Pill className="w-fit" key={status}>
                {status}
              </Pill>
            ))}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Label label="DOB" sameLine>
                {displayDate(patient.dateOfBirth)}
              </Label>
              <Label label="DOL" sameLine>
                {displayDate(patient.dateOfLoss)}
              </Label>
            </div>
            <Label label="Law Firm" sameLine>
              {patient.lawFirm}
            </Label>
            <Label label="Incident Type" sameLine>
              {patient.incidentType}
            </Label>
          </div>
          <div className="flex flex-col gap-2">
            <Label label="Email" sameLine>
              <a href={`mailto:${patient.email}`}>{patient.email}</a>
            </Label>
            <Label label="Phone" sameLine>
              <a href={`tel:${patient.phone}`}>{patient.phone}</a>
            </Label>
            <Button className="ml-auto">Message</Button>
          </div>
        </div>
      </div>
    // </Card>
  );
};

export const PatientViewId: React.FunctionComponent<{ id: string }> = ({
  id,
}) => {
  const query = useGetPatient(id);
  if (query.isLoading || query.isError) {
    return <>Loading</>;
  }
  const patient = query.data;
  if (!patient) {
    return <Header>Invalid Patient {id}</Header>;
  }

  return <PatientView key={patient.id} patient={patient} />;
};

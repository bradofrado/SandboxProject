import { useRouter } from "next/router";
import { ClosableContent } from "ui/src/components/core/closable-content";
import { Header } from "ui/src/components/core/header";
import type { Patient } from "model/src/patient";
import { PatientViewId } from "./patient/patient-view";
import { PatientsGrid } from "./patient/patients-grid";

export interface PatientViewProps {
  id?: string;
  items: Patient[];
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({
  id,
  items,
}) => {
  const router = useRouter();
  const onPatientClick = (_id: string | undefined): void => {
    void router.push(
      _id !== undefined ? `/patients/${_id}` : "/patients",
      undefined,
      { shallow: true },
    );
  };
  return (
    <div className="flex flex-col gap-2 px-2 py-6">
      <Header level={2}>Patients</Header>
      <PatientsGrid
        currPatient={id}
        onPatientClick={onPatientClick}
        patients={items}
      >
        <ClosableContent
					className="h-full"
          onClose={() => {
            onPatientClick(undefined);
          }}
        >
          {id ? <PatientViewId id={id} /> : null}
        </ClosableContent>
      </PatientsGrid>
    </div>
  );
};

import { useRouter } from "next/router";
import type { PatientListItem } from "model/src/patient";
import { ClosableContent } from "ui/src/components/core/closable-content";
import { Header } from "ui/src/components/core/header";
import { PatientViewId } from "./patient/patient-view";
import { PatientsGrid } from "./patient/patients-grid";

export interface PatientViewProps {
  id?: string;
  items: PatientListItem[];
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
    <div className="flex flex-col gap-2 p-2">
      <Header level={2}>Patients</Header>
      <PatientsGrid
        collapse={id !== undefined}
        onPatientClick={onPatientClick}
        patients={items}
      >
        <ClosableContent
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

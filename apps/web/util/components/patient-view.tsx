import { useRouter } from "next/router";
import { ClosableContent } from "ui/src/components/core/closable-content";
import { Header } from "ui/src/components/core/header";
import type { Patient } from "model/src/patient";
import { PatientViewId } from "./patient/patient-view";
import type { PatientGridFilter} from "./patient/patients-grid";
import { PatientsGrid } from "./patient/patients-grid";
import { Button } from "ui/src/components/core/button";
import { api } from "../api";
import { inter } from "../fonts";

export interface PatientViewProps {
  id?: string;
  items: Patient[];
	filter: PatientGridFilter;
	setFilter: (filter: PatientGridFilter) => void
}
export const PatientView: React.FunctionComponent<PatientViewProps> = ({
  id,
  items,
	filter,
	setFilter
}) => {
  const router = useRouter();
	const {mutate} = api.patients.testGetRequests.useMutation();
  const onPatientClick = (_id: string | undefined): void => {
    void router.push(
      _id !== undefined ? `/clients/${_id}` : "/clients",
      undefined,
      { shallow: true },
    );
  };
	const onRequest = () => {
		mutate();
	}
  return (
    <div className="flex flex-col gap-2 pl-4 pr-2 pt-6">
      <Header level={2}>Clients</Header>
			<Button className="w-fit" onClick={onRequest}>Request</Button>
      <PatientsGrid
        currPatient={id}
        filter={filter}
        onPatientClick={onPatientClick}
				patients={items}
				setFilter={setFilter}
      >
       {id ? <PatientViewId id={id} /> : null}
      </PatientsGrid>
    </div>
  );
};

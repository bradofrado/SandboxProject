import { type NextPage } from "next";
import { useGetPatients } from "../util/services/patient";
import { Layout } from "../util/components/layout";
import { PatientView } from "../util/components/patient-view";
import {
  defaultGetServerProps,
  requireAuth,
} from "../util/protected-routes-hoc";
import type { PatientGridFilter } from "../util/components/patient/patients-grid";

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage<{filter: PatientGridFilter, setFilter: (filter: PatientGridFilter) => void}> = ({filter, setFilter}) => {
  const query = useGetPatients();

  if (query.isError || query.isLoading) return <></>;

  const items = query.data;

  return (
    <Layout>
      <PatientView filter={filter} items={items} setFilter={setFilter}/>
    </Layout>
  );
};

export default Patients;

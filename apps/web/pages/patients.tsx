import { type NextPage } from "next";
import { useGetPatients } from "../util/services/patient";
import { Layout } from "../util/components/layout";
import { PatientView } from "../util/components/patient-view";
import {
  defaultGetServerProps,
  requireAuth,
} from "../util/protected-routes-hoc";

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
  const query = useGetPatients();

  if (query.isError || query.isLoading) return <>Loading</>;

  const items = query.data;

  return (
    <Layout>
      <PatientView items={items} />
    </Layout>
  );
};

export default Patients;

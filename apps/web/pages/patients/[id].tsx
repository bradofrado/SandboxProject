import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useGetPatients } from "../../util/services/patient";
import { Layout } from "../../util/components/layout";
import { PatientView } from "../../util/components/patient-view";
import type { PatientGridFilter } from "../../util/components/patient/patients-grid";

const PatientPage: NextPage<{filter: PatientGridFilter, setFilter: (filter: PatientGridFilter) => void}> = ({filter, setFilter}) => {
  const router = useRouter();
  const query = useGetPatients();
  
  if (query.isError || query.isLoading || !router.isReady || typeof router.query.id !== "string") return <div />;

  return (
    <Layout>
      <PatientView filter={filter} id={router.query.id} items={query.data} setFilter={setFilter}/>
    </Layout>
  );
};

export default PatientPage;

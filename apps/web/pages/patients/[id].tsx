import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useGetPatients } from "../../util/services/patient";
import { Layout } from "../../util/components/layout";
import { PatientView } from "../../util/components/patient-view";

const PatientPage: NextPage = () => {
  const router = useRouter();
  const query = useGetPatients();
  
  if (query.isError || query.isLoading || !router.isReady || typeof router.query.id !== "string") return <div />;

  return (
    <Layout>
      <PatientView id={router.query.id} items={query.data} />
    </Layout>
  );
};

export default PatientPage;

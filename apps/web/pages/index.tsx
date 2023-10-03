import { type NextPage } from "next";
import { Layout } from "../util/components/layout";
import {
  defaultGetServerProps,
  requireAuth,
} from "../util/protected-routes-hoc";

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Home: NextPage = () => {
  return <Layout />;
};

export default Home;

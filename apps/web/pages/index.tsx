import { type NextPage } from "next";
import { Layout } from "../util/components/layout";
import {
  defaultGetServerProps,
	requireRoute,
} from "../util/protected-routes-hoc";

export const getServerSideProps = requireRoute({redirect: '/tracking', check: () => true})(defaultGetServerProps);

const Home: NextPage = () => {
  return <Layout />;
};

export default Home;

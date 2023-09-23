import { type NextPage } from "next";
import { defaultGetServerProps, requireAuth } from "../util/protected-routes-hoc";
import { Layout } from "../util/components/layout";

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Home: NextPage = () => {
  return (
		<Layout/>
	)
};

export default Home;
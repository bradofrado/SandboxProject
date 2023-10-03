import { type NextPage } from "next";
import {
  defaultGetServerProps,
  requireAuth,
} from "../util/protected-routes-hoc";

export const getServerSideProps = requireAuth(defaultGetServerProps);

export interface Partner {
  name: string;
  id: string;
  // nickname: string,
  // website: string
}

const Partners: NextPage = () => {
  return <></>;
};

export default Partners;

import { GetStaticProps, type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { SideNav } from "~/utils/components/navigation/sidenav";

export const getStaticProps: GetStaticProps = () => {
  return {props: {}};
}

const Home: NextPage = () => {
  return (
    <>
      
    </>
  );
};

export default Home;

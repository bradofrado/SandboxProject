import type { NextPage } from "next";
import { useRouter } from "next/router";

const PatientPage: NextPage = () => {
	const router = useRouter();
	return <>Hello there {router.query.id}</>
}

export default PatientPage;
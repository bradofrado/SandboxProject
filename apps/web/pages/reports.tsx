import type { NextPage } from "next";
import {ReportingView} from 'ui/src/components/view/reports/reports-view'
import { Layout } from "../util/components/layout";

const ReportingPage: NextPage = () => {
	return (
		<Layout>
			<ReportingView/>
		</Layout>
	)
}

export default ReportingPage;
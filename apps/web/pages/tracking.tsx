import type { NextPage } from "next";
import type { DocumentRequest } from "model/src/patient";
import { Header } from "ui/src/components/core/header";
import { PatientRequestGrid } from "../util/components/patient/request-grid";
import { api } from "../util/api";
import { useDownloadDocumentRequest } from "../util/services/document";

const TrackingPage: NextPage = () => {
	const query = api.tracking.getPatients.useQuery();
	const {download} = useDownloadDocumentRequest();

  if (query.isError || query.isLoading) return <>Loading</>;

  const items = query.data;

	const onDownloadAttachments = (_: DocumentRequest): void => {
		console.log('Requesting document');
		download();
	}
	
	return (
		<div className="flex flex-col gap-2 pl-4 pr-2 pt-6">
      <Header className="text-center" level={2}>Medical Records and Bills Tracker</Header>
			<PatientRequestGrid onDownloadAttachments={onDownloadAttachments} patients={items}/>
		</div>
	)
}

export default TrackingPage;
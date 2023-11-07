import type { RecordType } from "model/src/core/utils";
import type { DocumentRequest, PatientRequest } from "model/src/patient";
import { displayDate } from "model/src/utils";
import { useState } from "react";
import { Button } from "ui/src/components/core/button";
import type { FilterChildren, FilterItem } from "ui/src/components/core/filter-button"
import type { FilterFunction, TableGridColumn } from "ui/src/components/core/table-grid";
import { FilterTableGrid, TableGrid } from "ui/src/components/core/table-grid"


interface RequestFilter {
	provider: number | undefined;
};

interface RequestItem {
	provider: string;
	date: Date;
	opened: boolean;
	response: boolean;
	received: boolean;
}

export interface PatientRequestGridProps {
	patients: PatientRequest[],
	onDownloadAttachments: (item: DocumentRequest) => void
}
export const PatientRequestGrid: React.FunctionComponent<PatientRequestGridProps> = ({patients, onDownloadAttachments}) => {
	const [filter, setFilter] = useState<RequestFilter>({provider: undefined});
	const [selectedPatient, setSelectedPatient] = useState<number | undefined>();
	const filterItems: FilterItem<RequestFilter>[] = [
		// {
		// 	id: 'provider',
		// 	value: filter.provider,
		// 	defaultValue: -1,
		// 	label: 'Provider'
		// }
	];
	const filterFunctions: FilterFunction<PatientRequest> = {
		// provider(key: Patient['provider']) {
		// 	return filter.provider !== undefined && filter.provider > -1 ? allProviders[filter.provider] === key : true;
		// }
	}

	//const allProviders = groupTogether(patients.map(patient => ({name: patient.provider})), 'name')

	const onChange = (items: FilterItem<RequestFilter>[]): void => {
		const newFilter = items.reduce<RequestFilter>(
      (prev, curr) => ({ ...prev, [curr.id]: curr.value }),
      {provider: undefined},
    );
    setFilter(newFilter);
	}
	const getFilterContent: FilterChildren<RequestFilter> = (item, changeItem) => {
		return <div/>
		// switch(item.id) {
		// 		case 'provider': {
		// 			const value = item.value;
		// 			return (
		// 				<Dropdown
		// 					initialValue={value}
		// 					items={allProviders.map((provider, i) => ({ name: provider, id: i }))}
		// 					onChange={(newItem) => {
		// 						changeItem(newItem.id);
		// 					}}
		// 				>
		// 					Select
		// 				</Dropdown>
		// 			);
		// 		}
		// }
	}

	const columns: TableGridColumn<keyof PatientRequest>[] = [
		{
			id: 'lastName',
			label: 'Last Name'
		},
		{
			id: 'firstName',
			label: 'First Name'
		},
		{
			id: 'dateOfBirth',
			label: 'Date of Birth'
		},
		{
			id: 'dateOfLoss',
			label: 'Date of Loss'
		},
	];

	const filterKeys: (keyof PatientRequest)[] = [
		'firstName', 'lastName'
	];
	const data: RecordType<PatientRequest>[] = patients;

	const onItemClick = (_: PatientRequest, index: number): void => {
		if (selectedPatient !== index) {
			setSelectedPatient(index);
		} else {
			setSelectedPatient(undefined);
		}
	}

	return (
		<FilterTableGrid columns={columns} data={data} filterFunctions={filterFunctions} filterKeys={filterKeys} getFilterContent={getFilterContent} items={filterItems} onChange={onChange} onItemClick={onItemClick} search>
			{(item, i) => ({
				gridItem: {
					id: '---',
					firstName: item.firstName,
					lastName: item.lastName,
					dateOfBirth: displayDate(item.dateOfBirth),
					dateOfLoss: displayDate(item.dateOfLoss),
					requests: '---'
				},
				extraContent: selectedPatient === i ? <RequestGrid onDownloadAttachments={onDownloadAttachments} requestItems={patients[i].requests}/> : undefined
			})}
		</FilterTableGrid>
	)
}

export interface RequestGridProps {
	requestItems: DocumentRequest[],
	onDownloadAttachments: (requestItem: DocumentRequest) => void
}
export const RequestGrid: React.FunctionComponent<RequestGridProps> = ({requestItems, onDownloadAttachments}) => {
	const displayBoolean = (value: boolean): string => {
		return value ? 'Yes' : 'No';
	}
	const getCellBackground = (request: RequestItem): {background: string, backgroundHover: string} | undefined => {
		if (request.received) {
			return {background: 'bg-green-200', backgroundHover: 'hover:bg-green-300'};
		} 

		return {background: 'bg-red-200', backgroundHover: 'hover:bg-red-300'};
	}

	const columns: TableGridColumn<keyof RequestItem>[] = [
		{
			id: 'provider',
			label: 'Provider'
		},
		{
			id: 'date',
			label: 'Record Requested Date',
		},
		{
			id: 'opened',
			label: 'Opened?'
		},
		{
			id: 'response',
			label: 'Response?'
		},
		{
			id: 'received',
			label: 'Received?'
		}
	];
	const items: RequestItem[] = requestItems.map(request => ({provider: request.sentEmail.to.name, date: request.sentEmail.date, opened: false, received: request.replies.some(reply => reply.attachments.length > 0), response: request.replies.length > 0}))

	return (
		<TableGrid columns={columns} data={items}>
			{(item, i) => ({
				gridItem: {
					provider: item.provider,
					date: displayDate(item.date),
					opened: displayBoolean(item.opened),
					response: displayBoolean(item.response),
					received: {
						label: item.received ? <div className="flex justify-between items-center">
							<span>{displayBoolean(item.received)}</span>
							<Button onClick={() => {onDownloadAttachments(requestItems[i])}}>Download</Button>
						</div> : displayBoolean(item.received),
						compareKey: displayBoolean(item.received)
					}
				},
				...getCellBackground(item)
			})}
		</TableGrid>
	)
}
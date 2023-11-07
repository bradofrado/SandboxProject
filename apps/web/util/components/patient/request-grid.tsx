import type { RecordType } from "model/src/core/utils";
import type { DocumentRequest, PatientRequest } from "model/src/patient";
import { compare, displayDate, displayTime } from "model/src/utils";
import { useState } from "react";
import { Button } from "ui/src/components/core/button";
import type { FilterChildren, FilterItem } from "ui/src/components/core/filter-button"
import type { FilterFunction, TableGridColumn } from "ui/src/components/core/table-grid";
import { FilterTableGrid, TableGrid } from "ui/src/components/core/table-grid"


interface RequestFilter {
	provider: number | undefined;
};

interface RequestItem {
	id: string;
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
	const [selectedPatient, setSelectedPatient] = useState<string | undefined>();
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
		'firstName', 'lastName', 'dateOfBirth', 'dateOfLoss'
	];
	const data: RecordType<PatientRequest>[] = patients;

	const onItemClick = (item: PatientRequest): void => {
		if (selectedPatient !== item.id) {
			setSelectedPatient(item.id);
		} else {
			setSelectedPatient(undefined);
		}
	}

	const sortOptions = [
		{
			id: '0', name: 'Most Recent Request', 
			sortFunc(items: PatientRequest[]): PatientRequest[] {
				return items.slice().sort((a, b) => {
					const d1 = a.requests.slice().sort((ra, rb) => compare(ra.sentEmail.date, rb.sentEmail.date));
					const d2 = b.requests.slice().sort((ra, rb) => compare(ra.sentEmail.date, rb.sentEmail.date));
					if (d1.length === 0 || d2.length === 0) {
						return compare(d2.length, d1.length);
					}

					return compare(d1[0].sentEmail.date, d2[0].sentEmail.date);
				});
			}
		}
	]

	return (
		<FilterTableGrid columns={columns} data={data} filterFunctions={filterFunctions} filterKeys={filterKeys} getFilterContent={getFilterContent} items={filterItems} onChange={onChange} onItemClick={onItemClick} search sortOptions={sortOptions}>
			{(item) => ({
				id: item.id,
				gridItem: {
					id: item.id,
					firstName: item.firstName,
					lastName: item.lastName,
					dateOfBirth: displayDate(item.dateOfBirth),
					dateOfLoss: displayDate(item.dateOfLoss),
					requests: '---'
				},
				extraContent: selectedPatient === item.id ? <RequestGrid onDownloadAttachments={onDownloadAttachments} requestItems={patients.find(patient => patient.id === item.id)?.requests || []}/> : undefined
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
	const items: RequestItem[] = requestItems.map(request => ({id: request.id, provider: request.sentEmail.to.name, date: request.sentEmail.date, opened: false, received: request.replies.some(reply => reply.attachments.length > 0), response: request.replies.length > 0}))

	return (
		<TableGrid columns={columns} data={items}>
			{(item, i) => ({
				id: item.id,
				gridItem: {
					id: '----',
					provider: item.provider,
					date: `${displayDate(item.date)} - ${displayTime(item.date)}`,
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
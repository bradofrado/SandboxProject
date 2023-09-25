import type { Patient } from "model/src/patient";
import {displayDate, formatDollarAmount} from 'model/src/utils';
import { Pill } from "../../core/pill";
import { type TableGridColumn, TableGrid } from "../../core/table-grid";
import React, { useState } from "react";
import { ListItem, DropdownList } from "../../core/dropdown";
import { Input } from "../../core/input";

const columns: TableGridColumn<PatientGridItem>[] = [
	{
		id: 'lastName',
		label: 'Last Name',
	},
	{
		id: 'firstName',
		label: 'First Name',
	},
	{
		id: 'lawFirm',
		label: 'Law Firm',
	},
	{
		id: 'primaryContact',
		label: 'Primary Contact',
	},
	{
		id: 'lastUpdate',
		label: 'Last Update',
	},
	{
		id: 'outstandingBalance',
		label: 'Outstanding Balance',
	},
]

export interface PatientsGridProps {
	patients: Patient[],
	searchKey?: string
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- For some reason a type is needed here
type PatientGridItem = {
	id: string,
	lastName: string,
	firstName: string,
	lawFirm: string,
	primaryContact: string,
	lastUpdate: {compareKey: string | number, label: React.ReactNode},
	outstandingBalance: {compareKey: string | number, label: React.ReactNode}
}
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({patients, searchKey}) => {
	const items: PatientGridItem[] = patients.map(({id, lastName, firstName, lawFirm, primaryContact, lastUpdateDate, outstandingBalance, statuses}) => ({
		id: `patients/${id}`, lastName, firstName, lawFirm, primaryContact,
		lastUpdate: {compareKey: lastUpdateDate ? `${displayDate(lastUpdateDate)}${statuses.join('')}` : '---', label: <LastUpdateComponent date={lastUpdateDate} statuses={statuses}/>},
		outstandingBalance: {compareKey: outstandingBalance, label: <span className="text-primary">{formatDollarAmount(outstandingBalance)}</span>}
	}));
	
	const filtered = filterItems(items, searchKey, (value) => (value as PatientGridItem['lastUpdate']).compareKey);
    return (
			<TableGrid columns={columns} items={filtered} itemsPerPage={12} linkKey="id"/>
		)
}

const LastUpdateComponent: React.FunctionComponent<{date: Date | null, statuses: string[]}> = ({date, statuses}) => {
	return date ? (
		<div className="flex flex-col gap-1">
			<span>{displayDate(date)}</span>
			{statuses.map(status => <Pill className="w-fit" key={status}>{status}</Pill>)}
		</div>
	) : <span>---</span>
}

function filterItems<T extends Record<string, unknown>>(items: T[], filterKey: string | undefined, getCompareKey?: (value: unknown) => string | number): T[] {
	const _getCompareKey = (value: unknown): string | number => {
		if (typeof value === 'string') return value.toLowerCase();
		if (!getCompareKey) throw new Error('Must provide a compare key function for non strings');

		const key = getCompareKey(value);
		if (typeof key === 'string') {
			return key.toLowerCase();
		}

		return key;
	}
	const reduceItem = (item: T): string =>  Object.values(item).reduce<string>((prev, curr) => prev + _getCompareKey(curr), '')

	return items.filter(item => reduceItem(item).includes((filterKey || '').toLowerCase()));
}
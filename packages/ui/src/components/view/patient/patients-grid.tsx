import type { Patient } from "model/src/patient";
import {displayDate, formatDollarAmount, groupTogether} from 'model/src/utils';
import { useState } from "react";
import { Pill } from "../../core/pill";
import { type TableGridColumn, TableGrid } from "../../core/table-grid";
import { DatePicker } from "../../core/date-picker";
import type { ListItem, DropdownItem} from "../../core/dropdown";
import { Dropdown, ListBox, DropdownListItem } from "../../core/dropdown";
import { Input } from "../../core/input";
import { useChangeProperty } from "../../../hooks/change-property";

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
		id: 'lastUpdateDate',
		label: 'Last Update',
	},
	{
		id: 'outstandingBalance',
		label: 'Outstanding Balance',
	},
]

interface DateRange {
	start: Date | null,
	end: Date | null
}

interface PatientGridFilter {
	dateOfLost: DateRange | undefined,
	lastUpdate: DateRange | undefined,
	attorney: number | undefined
}

export interface PatientsGridProps {
	patients: Patient[],
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- For some reason a type is needed here
type PatientGridItem = {
	id: string,
	lastName: string,
	firstName: string,
	lawFirm: string,
	primaryContact: string,
	lastUpdateDate: {compareKey: string | number, label: React.ReactNode},
	outstandingBalance: {compareKey: string | number, label: React.ReactNode}
}
type PatientType = {[P in keyof Patient]: Patient[P]};
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({patients}) => {
	const [searchKey, setSearchKey] = useState('');
	const [filter, setFilter] = useState<PatientGridFilter>({dateOfLost: undefined, lastUpdate: undefined, attorney: undefined});
	const changeFilter = useChangeProperty<PatientGridFilter>(setFilter);

	const allLawFirms = groupTogether(patients, 'lawFirm');
	const filterColumns = [
		{
			label: 'Date of Loss', 
			value: filter.dateOfLost !== undefined, 
			content: <DateToDatePicker end={filter.dateOfLost?.end ?? null} onChange={(value) => changeFilter(filter, 'dateOfLost', value)}  start={filter.dateOfLost?.start ?? null}/>
		}, 
		{
			label: 'Last Update', 
			value: filter.lastUpdate !== undefined, 
			content: <DateToDatePicker end={filter.lastUpdate?.end ?? null} onChange={(value) => changeFilter(filter, 'lastUpdate', value)}  start={filter.lastUpdate?.start ?? null}/>
		}, 
		{
			label: 'By Attorney', 
			value: filter.attorney !== undefined, 
			content: <Dropdown initialValue={filter.attorney} items={allLawFirms.map((firm, i) => ({name: firm, id: i}))} onChange={(item) => changeFilter(filter, 'attorney', item.id)}>Select</Dropdown>
		}
	];
	const filterFunctions: {[P in keyof Patient]?: (key: Patient[P]) => boolean} = {
		dateOfLoss: (key: Patient['dateOfLoss']) =>  isDateInBetween(key, filter.dateOfLost?.start ?? null, filter.dateOfLost?.end ?? null),
		lastUpdateDate: (key: Patient['lastUpdateDate']) => isDateInBetween(key, filter.lastUpdate?.start ?? null, filter.lastUpdate?.end ?? null),
		lawFirm: (key: Patient['lawFirm']) => filter.attorney !== undefined && filter.attorney > -1 ? key === allLawFirms[filter.attorney] : true
	}

	const onFilterChange = (_filterItems: FilterItem[]): void => {
		const dateOfLoss = _filterItems.find(item => item.label === 'Date of Loss');
		const lastUpdate = _filterItems.find(item => item.label === 'Last Update');
		const attorneyItem = _filterItems.find(item => item.label === 'By Attorney');

		let next = changeFilter(filter, 'dateOfLost', dateOfLoss?.value ? filter.dateOfLost ?? {start: null, end: null} : undefined);
		next = changeFilter(next, 'lastUpdate', lastUpdate?.value ? filter.lastUpdate ?? {start: null, end: null} : undefined);
		changeFilter(next, 'attorney', attorneyItem?.value ? filter.attorney ?? -1 : undefined);
	}

	const filteredPatients = filterCriteria<PatientType>(patients, filterFunctions);
	const items: PatientGridItem[] = filteredPatients.map(({id, lastName, firstName, lawFirm, primaryContact, lastUpdateDate, outstandingBalance, statuses}) => ({
		id: `patients/${id}`, lastName, firstName, lawFirm, primaryContact,
		lastUpdateDate: {compareKey: lastUpdateDate ? `${displayDate(lastUpdateDate)}${statuses.join('')}` : '---', label: <LastUpdateComponent date={lastUpdateDate} statuses={statuses}/>},
		outstandingBalance: {compareKey: outstandingBalance, label: <span className="text-primary">{formatDollarAmount(outstandingBalance)}</span>}
	}));
	
	const filtered = filterItems(items, searchKey, (value) => (value as PatientGridItem['lastUpdateDate']).compareKey);
	return (<>
		<div className="flex w-fit gap-2">
			<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
			<FilterButton items={filterColumns} onChange={onFilterChange}>
				Filters
			</FilterButton>
		</div>
		<TableGrid columns={columns} items={filtered} itemsPerPage={12} linkKey="id"/>
		</>
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

interface DateToDatePickerProps {
	start: Date | null,
	end: Date | null,
	onChange: (range: {start: Date | null, end: Date | null}) => void
}
const DateToDatePicker: React.FunctionComponent<DateToDatePickerProps> = ({start, end, onChange}) => {
	return (
		<span className="flex gap-1 items-center">
			<DatePicker date={start} onChange={(value) => {onChange({start: value, end})}}/>
			to 
			<DatePicker date={end} onChange={(value) => {onChange({start, end: value})}}/>
		</span>
	)
}

interface FilterItem extends ListItem {
	content: React.ReactNode
}
interface FilterButtonProps {
	items: FilterItem[],
	onChange: (items: FilterItem[]) => void,
	children: React.ReactNode
}
const FilterButton: React.FunctionComponent<FilterButtonProps> = ({items, children, onChange}) => {
	const copy = items.slice();
	const onSelect = (item: FilterItem, value: boolean): void => {
		item.value = value;
		onChange(copy);
	}
	const dropdownItems: DropdownItem<number>[] = copy.map((item, i) => ({id: i, name: <FilterButtonItem item={item} onChange={(value) => {onSelect(item, value)}}/>}))
	return (
		<ListBox items={dropdownItems}>
			{children}
		</ListBox>
	)
}

interface FilterButtonItemProps {
	item: FilterItem,
	onChange: (value: boolean) => void
}
const FilterButtonItem: React.FunctionComponent<FilterButtonItemProps> = ({item, onChange}) => {
	const {content, ...listItem} = item;
	return (
		<>
			<button className="p-2 w-full border-b" onClick={() => {onChange(!item.value)}} type='button'>
				<DropdownListItem item={listItem}/>
			</button>
			<div className={`${item.value ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-[max-height] bg-gray-50`}>
				<div className="p-2">
					{content}
				</div>
			</div>
		</>
	)
}

function isDateInBetween(test: Date | null, start: Date | null, end: Date | null): boolean {
	if (test === null) {
		return true;
	}
	return (start !== null ? start <= test : true) && (end !== null ? test <= end : true);
}

function filterCriteria<T extends Record<string, unknown>>(items: T[], filterObject:  {[P in keyof T]?: (key: T[P]) => boolean}): T[] {
	const filterItem = (item: T): boolean => {
		for (const key in filterObject) {
			const predicate = filterObject[key];
			if (predicate && !predicate(item[key])) {
				return false;
			}
		}
		return true;
	}
	return items.filter(item => filterItem(item));
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
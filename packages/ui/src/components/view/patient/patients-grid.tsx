import type { Patient } from "model/src/patient";
import {displayDate, formatDollarAmount, groupTogether, isDateInBetween} from 'model/src/utils';
import { useState } from "react";
import { Pill } from "../../core/pill";
import { type TableGridColumn, TableGrid } from "../../core/table-grid";
import { DatePicker } from "../../core/date-picker";
import type { ListItem, DropdownItem} from "../../core/dropdown";
import { Dropdown, ListBox, DropdownListItem } from "../../core/dropdown";
import { Input } from "../../core/input";
import { useChangeProperty } from "../../../hooks/change-property";
import { FilterIcon } from "../../core/icons";
import { Button } from "../../core/button";
import { Header } from "../../core/header";

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
	

	const allLawFirms = groupTogether(patients, 'lawFirm');
	
	const filterFunctions: {[P in keyof Patient]?: (key: Patient[P]) => boolean} = {
		dateOfLoss: (key: Patient['dateOfLoss']) =>  isDateInBetween(key, filter.dateOfLost?.start ?? null, filter.dateOfLost?.end ?? null),
		lastUpdateDate: (key: Patient['lastUpdateDate']) => isDateInBetween(key, filter.lastUpdate?.start ?? null, filter.lastUpdate?.end ?? null),
		lawFirm: (key: Patient['lawFirm']) => filter.attorney !== undefined && filter.attorney > -1 ? key === allLawFirms[filter.attorney] : true
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
			<FilterButton filter={filter} lawFirms={allLawFirms} onChange={setFilter}/>
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
	label: string,
	content: React.ReactNode,
	defaultValue: PatientGridFilter[keyof PatientGridFilter]
}
interface FilterButtonProps {
	filter: PatientGridFilter,
	lawFirms: string[],
	onChange: (filter: PatientGridFilter) => void
}
const FilterButton = ({lawFirms, filter: initialFilter, onChange}: FilterButtonProps): JSX.Element => {
	const [filter, setFilter] = useState(initialFilter);
	const changeFilter = useChangeProperty<PatientGridFilter>(setFilter);
	const [isOpen, setIsOpen] = useState(false);

	const filterColumns: FilterItem[] = [
		{
			label: 'Date of Loss', 
			value: filter.dateOfLost !== undefined, 
			defaultValue: {start: null, end: null},
			content: <DateToDatePicker end={filter.dateOfLost?.end ?? null} onChange={(value) => changeFilter(filter, 'dateOfLost', value)}  start={filter.dateOfLost?.start ?? null}/>
		}, 
		{
			label: 'Last Update', 
			value: filter.lastUpdate !== undefined, 
			defaultValue: {start: null, end: null},
			content: <DateToDatePicker end={filter.lastUpdate?.end ?? null} onChange={(value) => changeFilter(filter, 'lastUpdate', value)}  start={filter.lastUpdate?.start ?? null}/>
		}, 
		{
			label: 'By Attorney', 
			value: filter.attorney !== undefined, 
			defaultValue: -1,
			content: <Dropdown initialValue={filter.attorney} items={lawFirms.map((firm, i) => ({name: firm, id: i}))} onChange={(item) => changeFilter(filter, 'attorney', item.id)}>Select</Dropdown>
		}
	];

	const onSelect = (item: FilterItem, value: boolean): void => {
		const labelToKeyMapping: Record<string, keyof PatientGridFilter> = {
			'Date of Loss': 'dateOfLost',
			'Last Update': 'lastUpdate',
			'By Attorney': 'attorney'
		}
		const key = labelToKeyMapping[item.label];
		changeFilter(filter, key, value ? item.defaultValue : undefined);
	}

	const onClear = (): void => {
		setFilter({dateOfLost: undefined, lastUpdate: undefined, attorney: undefined});
	}

	const onDone = (): void => {
		onChange(filter);
	}

	const onOpen = (value: boolean): void => {
		//This is to 'cancel' their selection if they close the popup
		if (!value) {
			setFilter(initialFilter);
		}
		setIsOpen(value);
	}

	const dropdownItems: DropdownItem<number>[] = filterColumns.map((item, i) => ({id: i, name: <FilterButtonItem item={item} onChange={(value) => {onSelect(item, value)}}/>}));
	const header = <div className="flex justify-between items-center">
		<Button className="h-fit" mode='secondary' onClick={onClear}>Clear</Button>
		<Header level={4}>Filters</Header>
		<Button className="h-fit" mode='primary' onClick={onDone}>Done</Button>
	</div>
	return (
		<ListBox header={header} isOpen={isOpen} items={dropdownItems} setIsOpen={onOpen}>
			<FilterIcon className="w-3 h-3 fill-white mr-1"/> Filters
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
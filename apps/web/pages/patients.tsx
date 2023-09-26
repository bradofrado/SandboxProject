import { type NextPage} from 'next';
import { useState } from 'react';
import { Header } from 'ui/src/components/core/header';
import { Input } from 'ui/src/components/core/input';
import {PatientsGrid} from 'ui/src/components/view/patient/patients-grid'
import {useGetPatients} from 'ui/src/services/patient';
import { DatePicker } from 'ui/src/components/core/date-picker';
import { Dropdown, type DropdownItem, DropdownListItem, ListBox, type ListItem } from 'ui/src/components/core/dropdown';
import { requireAuth, defaultGetServerProps } from '../util/protected-routes-hoc';
import { Layout } from '../util/components/layout';

export const getServerSideProps = requireAuth(defaultGetServerProps);

const Patients: NextPage = () => {
	const query = useGetPatients();
	const [searchKey, setSearchKey] = useState('');
	const [filterColumns, setFilterColumns] = useState<FilterItem[]>([{label: 'Date of Loss', value: false, content: <DateToDatePicker start={new Date()} end={new Date()}  onChange={() => undefined}/>}, {label: 'Last Update', value: false, content: <DateToDatePicker start={new Date()} end={new Date()}  onChange={() => undefined}/>}, {label: 'By Attorney', value: false, content: <Dropdown items={[{name: 'Siegboi', id: 0}]}>Hello</Dropdown>}])
	
	if (query.isError || query.isLoading) return <>Loading</>

	const items = query.data;
    
    return (
			<Layout>
				<div className="flex flex-col gap-2 p-2">
					<Header level={2}>Patients</Header>
					<div className="flex w-fit gap-2">
						<Input className="h-8" onChange={setSearchKey} placeholder='Search' value={searchKey}/>
						<FilterButton items={filterColumns} onChange={setFilterColumns}>
							Filters
						</FilterButton>
					</div>
					<PatientsGrid patients={items}/>
				</div>
			</Layout>
		)
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
			<div className={`${item.value ? 'max-h-52' : 'max-h-0'} overflow-hidden transition-[max-height] bg-gray-50`}>
				<div className="p-2">
					{content}
				</div>
			</div>
		</>
	)
}

export default Patients;
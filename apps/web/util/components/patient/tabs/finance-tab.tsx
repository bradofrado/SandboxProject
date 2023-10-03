import type { Patient, PatientFinanceProvider } from "model/src/patient";
import { formatDollarAmount, groupTogether } from "model/src/utils";
import type { RecordType } from "model/src/core/utils";
import { useState } from "react";
import { Pill } from "ui/src/components/core/pill";
import type { TableGridColumn, TableGridFooter } from "ui/src/components/core/table-grid";
import { FilterTableGrid } from "ui/src/components/core/table-grid";
import type { FilterChildren, FilterItem } from "ui/src/components/core/filter-button";
import { Dropdown } from "ui/src/components/core/dropdown";
import { useGetPatientFinanceProviders } from "../../../services/patient";

interface PatientFinanceProviderFilter {
	status: number | undefined,
	name: number | undefined
}
type PatientFinanceProviderType = RecordType<PatientFinanceProvider>
export interface FinanceTabProps {
  patient: Patient;
}
export const FinanceTab: React.FunctionComponent<FinanceTabProps> = ({
  patient,
}) => {
  const query = useGetPatientFinanceProviders(patient.id);
	const [filter, setFilter] = useState<PatientFinanceProviderFilter>({status: undefined, name: undefined})
  if (query.isError || query.isLoading) return <>Loading</>;

  const providers = query.data as PatientFinanceProviderType[];

  const columns: TableGridColumn<'name' | 'status' | 'amount'>[] = [
    {
      id: "name",
      label: "Provider",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "amount",
      label: "Amount",
    },
  ];

  const footer = (items: PatientFinanceProviderType[]): TableGridFooter<typeof columns[number]['id']> => ({
    name: <span className="font-medium text-black">Total Due</span>,
    status: "",
    amount: (
      <span className="font-medium text-black">
        {formatDollarAmount(items.reduce(
					(prev, curr) => prev + (curr.status === "Unpaid" ? curr.amount : 0),
					0,
				))}
      </span>
    ),
  });

	const allProviders = groupTogether(providers, 'name');

	const getFilterContent: FilterChildren<PatientFinanceProviderFilter> = (item, changeItem) => {
		switch(item.id) {
			case 'name':
				return <Dropdown initialValue={item.value} items={allProviders.map((name, i) => ({id: i, name}))} onChange={(dropdownItem) => {changeItem(dropdownItem.id)}}>Select</Dropdown>
			case 'status':
				return <Dropdown initialValue={item.value} items={[{id: 0, name: 'Paid'}, {id: 1, name: 'Unpaid'}]} onChange={(dropdownItem) => {changeItem(dropdownItem.id)}}>Select</Dropdown>
		}
	}

	const filterItems: FilterItem<PatientFinanceProviderFilter>[] = [
		{
			id: 'status',
			label: 'Status',
			value: filter.status,
			defaultValue: -1
		},
		{
			id: 'name',
			label: 'Provider',
			value: filter.name,
			defaultValue: -1
		}
	];

	const filterFunctions = {
		status: (key: string) => filter.status !== undefined && filter.status > -1 ? key === ['Paid', 'Unpaid'][filter.status] : true,
		name: (key: string) => filter.name !== undefined && filter.name > -1 ? key === allProviders[filter.name] : true
	}

	const onFilterChange = (newItems: FilterItem<PatientFinanceProviderFilter>[]): void => {
		const newFilter = newItems.reduce<PatientFinanceProviderFilter>(
      (prev, curr) => ({ ...prev, [curr.id]: curr.value }),
      {name: undefined, status: undefined},
    );
    setFilter(newFilter);
	}

  const onItemClick = (_: PatientFinanceProviderType): void => {
    //TODO: Make this functional
  };
  return (
    <div>
      <FilterTableGrid
				columns={columns}
        data={providers}
        filterFunctions={filterFunctions}
        filterKeys={['amount', 'name', 'status']}
				footer={footer}
				getFilterContent={getFilterContent}
				items={filterItems}
				onChange={onFilterChange}
				onItemClick={onItemClick}
				search
      >
				{(provider) => ({
					...provider,
					status: {
						compareKey: provider.status,
						label: <StatusPill status={provider.status} />,
					},
					amount: {
						compareKey: provider.amount,
						label: formatDollarAmount(provider.amount),
					},
				})}
			</FilterTableGrid>
    </div>
  );
};

const StatusPill: React.FunctionComponent<{ status: string }> = ({
  status,
}) => {
  return (
    <Pill className="w-fit" mode={status === "Paid" ? "success" : "error"}>
      {status}
    </Pill>
  );
};

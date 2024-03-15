import type { Patient } from "model/src/patient";
import {
  displayDate,
  formatDollarAmount,
  groupTogether,
  isDateInBetween,
} from "model/src/utils";
import type {RecordType} from 'model/src/core/utils';
import { DatePicker } from "ui/src/components/core/date-picker";
import { Dropdown } from "ui/src/components/core/dropdown";
import { Pill } from "ui/src/components/core/pill";
import { FilterTableGrid, type TableGridColumn } from "ui/src/components/core/table-grid";
import type { FilterChildren, FilterItem} from "ui/src/components/core/filter-button";

const columns: TableGridColumn<'lastName' | 'firstName' | 'lawFirm' | 'primaryContact' | 'lastUpdateDate' | 'outstandingBalance'>[] = [
  {
    id: "firstName",
    label: "First Name",
  },
	{
    id: "lastName",
    label: "Last Name",
  },
  {
    id: "lawFirm",
    label: "Law Firm",
  },
  {
    id: "primaryContact",
    label: "Primary Contact",
  },
  {
    id: "lastUpdateDate",
    label: "Last Update",
  },
  {
    id: "outstandingBalance",
    label: "Outstanding Balance",
  },
];

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface PatientGridFilter {
  dateOfLost: DateRange | undefined;
  lastUpdate: DateRange | undefined;
  attorney: number | undefined;
}

export interface PatientsGridProps {
  patients: Patient[];
  currPatient: string | undefined;
  children?: React.ReactNode;
  onPatientClick: (id: string | undefined) => void;
	filter: PatientGridFilter;
	setFilter: (filter: PatientGridFilter) => void
}
 
type PatientType = RecordType<Patient>
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({
  patients,
  children,
  onPatientClick,
  currPatient,
	filter,
	setFilter
}) => {
	const collapse = currPatient !== undefined;

  const allLawFirms = groupTogether(patients, "lawFirm");

  const filterFunctions: {
    [P in keyof Patient]?: (key: Patient[P]) => boolean;
  } = {
    dateOfLoss: (key: Patient["dateOfLoss"]) =>
      isDateInBetween(
        key,
        filter.dateOfLost?.start ?? undefined,
        filter.dateOfLost?.end ?? undefined,
      ),
    lastUpdateDate: (key: Patient["lastUpdateDate"]) =>
      isDateInBetween(
        key,
        filter.lastUpdate?.start ?? undefined,
        filter.lastUpdate?.end ?? undefined,
      ),
    lawFirm: (key: Patient["lawFirm"]) =>
      filter.attorney !== undefined && filter.attorney > -1
        ? key === allLawFirms[filter.attorney]
        : true,
  };

	const filterItems: FilterItem<PatientGridFilter>[] = [
    {
      id: "dateOfLost",
      label: "Date of Loss",
      value: filter.dateOfLost,
      defaultValue: { start: null, end: null },
    },
    {
      id: "lastUpdate",
      label: "Last Update",
      value: filter.lastUpdate,
      defaultValue: { start: null, end: null },
    },
    {
      id: "attorney",
      label: "By Attorney",
      value: filter.attorney,
      defaultValue: -1,
    },
  ];

	const getFilterContent: FilterChildren<PatientGridFilter> = (item, changeItem) => {
		switch (item.id) {
			case "dateOfLost": {
				const value = item.value;
				return (
					<DateToDatePicker
						end={value?.end ?? null}
						onChange={(_value) => {
							changeItem(_value);
						}}
						start={value?.start ?? null}
					/>
				);
			}
			case "lastUpdate": {
				const value = item.value;
				return (
					<DateToDatePicker
						end={value?.end ?? null}
						onChange={(_value) => {
							changeItem(_value);
						}}
						start={value?.start ?? null}
					/>
				);
			}
			case "attorney": {
				const value = item.value;
				return (
					<Dropdown
						initialValue={value}
						items={allLawFirms.map((firm, i) => ({ name: firm, id: i }))}
						onChange={(newItem) => {
							changeItem(newItem.id);
						}}
					>
						Select
					</Dropdown>
				);
			}
		}
	}

	const getCellBackground = (patient: Patient): {background: string, backgroundHover: string} | undefined => {
		switch (patient.status) {
			case 'Document Requested': return {background: 'bg-red-200', backgroundHover: 'hover:bg-red-300'};
			case 'Referral': return {background: 'bg-green-200', backgroundHover: 'hover:bg-green-300'};
			default: return undefined;
		}
	}

	const filterKeys: (keyof Patient)[] = [
		"lastUpdateDate",
		"firstName",
		"lastName",
		"outstandingBalance",
		"lawFirm",
		"primaryContact",
		"status",
	]

	const onFilterChange = (newItems: FilterItem<PatientGridFilter>[]): void => {
    const newFilter = newItems.reduce<PatientGridFilter>(
      (prev, curr) => ({ ...prev, [curr.id]: curr.value }),
      { dateOfLost: undefined, lastUpdate: undefined, attorney: undefined },
    );
    setFilter(newFilter);
  };

  const getTableGrid = (): React.ReactNode => {
    if (collapse) {
      const collapsedColumns: { id: "name"; label: string }[] = [
        { id: "name", label: "Full Name" },
      ];

      return (
        <FilterTableGrid
					columns={collapsedColumns}
          data={patients.map(patient => ({...patient, name: `${patient.firstName} ${patient.lastName}`}))}
          filterFunctions={filterFunctions}
          filterKeys={filterKeys}
					getFilterContent={getFilterContent}
					items={filterItems}
					itemsPerPage={12}
					onChange={onFilterChange}
					onItemClick={(item) => {
            onPatientClick(item.id === currPatient ? undefined : item.id);
          }}
					search
        >
					{(patient) => {
						return {
							gridItem: {
								id: patient.id,
								name: {
									compareKey: patient.name,
									label: <CollapsedPatient patient={patient} />,
								},
							},
							...getCellBackground(patient)
						}
					}}
				</FilterTableGrid>
      );
    }

    return (
      <FilterTableGrid<PatientGridFilter, PatientType, typeof columns[number]['id']>
				className="w-full"
        columns={columns}
        data={patients}
        filterFunctions={filterFunctions}
        filterKeys={filterKeys}
				getFilterContent={getFilterContent}
				items={filterItems}
				itemsPerPage={12}
				onChange={onFilterChange}
				onItemClick={(item) => {
          onPatientClick(item.id);
        }}
				search
      >
			{({
        id,
        lastName,
        firstName,
        lawFirm,
        primaryContact,
        lastUpdateDate,
        outstandingBalance,
        status,
      }) => ({
        gridItem: {
					id,
					lastName,
					firstName,
					lawFirm: lawFirm ? lawFirm :  'Unknown',
					primaryContact: primaryContact ? primaryContact : '---',
					lastUpdateDate: {
						compareKey: lastUpdateDate
							? `${displayDate(lastUpdateDate)}${status}`
							: "---",
						label: (
							<LastUpdateComponent date={lastUpdateDate} statuses={status ? [status] : []} />
						),
					},
					outstandingBalance: {
						compareKey: outstandingBalance,
						label: (
							<span className="text-primary font-semibold">
								{formatDollarAmount(outstandingBalance)}
							</span>
						),
					},
				}
      })}
			</FilterTableGrid>
    );
  };

  return (
		<div className="flex gap-2">
			<div className={`${collapse ? '' : 'w-full'}`}>{getTableGrid()}</div>
			{collapse ? <div className="flex-1">{children}</div> : null}
		</div>
    );
};

const LastUpdateComponent: React.FunctionComponent<{
  date: Date | undefined;
  statuses: string[];
}> = ({ date, statuses }) => {
  return date ? (
    <div className="flex flex-col gap-1">
      <span>{displayDate(date)}</span>
      {statuses.map((status) => (
        <Pill className="w-fit" key={status}>
          {status}
        </Pill>
      ))}
    </div>
  ) : (
    <span>---</span>
  );
};

const CollapsedPatient: React.FunctionComponent<{ patient: Patient }> = ({
  patient,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {patient.firstName} {patient.lastName}
      </span>
      <div className="flex flex-col gap-1">
        {/* <div className="flex gap-1">
					<span className="text-xs">Last Update: {displayDate(patient.dateOfBirth)}</span>
					<span className="text-xs">{patient.lawFirm}</span>
				</div> */}
        <span className="text-xs">{patient.lawFirm}</span>
        <span className="text-xs">
          Last Update: {displayDate(new Date(2023, 10, 3))}
        </span>
        {patient.status ? (
          <Pill className="w-fit bg-[#DBDFFEFF]">{patient.status}</Pill>
        ) : null}
      </div>
    </div>
  );
};

interface DateToDatePickerProps {
  start: Date | null;
  end: Date | null;
  onChange: (range: { start: Date | null; end: Date | null }) => void;
}
const DateToDatePicker: React.FunctionComponent<DateToDatePickerProps> = ({
  start,
  end,
  onChange,
}) => {
  return (
    <span className="flex gap-1 items-center">
      <DatePicker
        date={start}
        onChange={(value) => {
          onChange({ start: value, end });
        }}
      />
      to
      <DatePicker
        date={end}
        onChange={(value) => {
          onChange({ start, end: value });
        }}
      />
    </span>
  );
};

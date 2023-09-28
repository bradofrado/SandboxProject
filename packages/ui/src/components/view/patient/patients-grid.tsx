import { useState } from "react";
import type { Patient } from "model/src/patient";
import {
  displayDate,
  formatDollarAmount,
  groupTogether,
  isDateInBetween,
} from "model/src/utils";
import { DatePicker } from "../../core/date-picker";
import { Dropdown } from "../../core/dropdown";
import { Pill } from "../../core/pill";
import { FilterTableGrid, type TableGridColumn } from "../../core/table-grid";
import type { FilterChildren, FilterItem} from "../../core/filter-button";

const columns: TableGridColumn<'lastName' | 'firstName' | 'lawFirm' | 'primaryContact' | 'lastUpdateDate' | 'outstandingBalance'>[] = [
  {
    id: "lastName",
    label: "Last Name",
  },
  {
    id: "firstName",
    label: "First Name",
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

interface PatientGridFilter {
  dateOfLost: DateRange | undefined;
  lastUpdate: DateRange | undefined;
  attorney: number | undefined;
}

export interface PatientsGridProps {
  patients: Patient[];
  collapse?: boolean;
  children?: React.ReactNode;
  onPatientClick: (id: string) => void;
}
 
// type PatientGridItem = {
//   id: string;
//   lastName: string;
//   firstName: string;
//   lawFirm: string;
//   primaryContact: string;
//   lastUpdateDate: { compareKey: string | number; label: React.ReactNode };
//   outstandingBalance: { compareKey: string | number; label: React.ReactNode };
// };
type PatientType = { [P in keyof Patient]: Patient[P] };
export const PatientsGrid: React.FunctionComponent<PatientsGridProps> = ({
  patients,
  children,
  onPatientClick,
  collapse = false,
}) => {
  const [filter, setFilter] = useState<PatientGridFilter>({
    dateOfLost: undefined,
    lastUpdate: undefined,
    attorney: undefined,
  });

  const allLawFirms = groupTogether(patients, "lawFirm");

  const filterFunctions: {
    [P in keyof Patient]?: (key: Patient[P]) => boolean;
  } = {
    dateOfLoss: (key: Patient["dateOfLoss"]) =>
      isDateInBetween(
        key,
        filter.dateOfLost?.start ?? null,
        filter.dateOfLost?.end ?? null,
      ),
    lastUpdateDate: (key: Patient["lastUpdateDate"]) =>
      isDateInBetween(
        key,
        filter.lastUpdate?.start ?? null,
        filter.lastUpdate?.end ?? null,
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

	const filterKeys: (keyof Patient)[] = [
		"lastUpdateDate",
		"firstName",
		"lastName",
		"outstandingBalance",
		"lawFirm",
		"primaryContact",
		"statuses",
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
            onPatientClick(item.id);
          }}
					search
        >
					{(patient) => {
						return {
							id: patient.id,
							name: {
								compareKey: patient.name,
								label: <CollapsedPatient patient={patient} />,
							},
						};
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
        statuses,
      }) => ({
        id,
        lastName,
        firstName,
        lawFirm,
        primaryContact,
        lastUpdateDate: {
          compareKey: lastUpdateDate
            ? `${displayDate(lastUpdateDate)}${statuses.join("")}`
            : "---",
          label: (
            <LastUpdateComponent date={lastUpdateDate} statuses={statuses} />
          ),
        },
        outstandingBalance: {
          compareKey: outstandingBalance,
          label: (
            <span className="text-primary">
              {formatDollarAmount(outstandingBalance)}
            </span>
          ),
        },
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
  date: Date | null;
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
          Last Update: {displayDate(patient.dateOfBirth)}
        </span>
        {patient.statuses.length > 0 ? (
          <Pill className="w-fit">{patient.statuses[0]}</Pill>
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

// interface PatientGridFilterButtonProps {
//   filter: PatientGridFilter;
//   lawFirms: string[];
//   onChange: (filter: PatientGridFilter) => void;
// }
// const PatientGridFilterButton: React.FunctionComponent<
//   PatientGridFilterButtonProps
// > = ({ lawFirms, filter, onChange }) => {
//   const items: FilterItem<PatientGridFilter>[] = [
//     {
//       id: "dateOfLost",
//       label: "Date of Loss",
//       value: filter.dateOfLost,
//       defaultValue: { start: null, end: null },
//     },
//     {
//       id: "lastUpdate",
//       label: "Last Update",
//       value: filter.lastUpdate,
//       defaultValue: { start: null, end: null },
//     },
//     {
//       id: "attorney",
//       label: "By Attorney",
//       value: filter.attorney,
//       defaultValue: -1,
//     },
//   ];

//   const onFilterChange = (newItems: FilterItem<PatientGridFilter>[]): void => {
//     const newFilter = newItems.reduce<PatientGridFilter>(
//       (prev, curr) => ({ ...prev, [curr.id]: curr.value }),
//       { dateOfLost: undefined, lastUpdate: undefined, attorney: undefined },
//     );
//     onChange(newFilter);
//   };

//   return (
//     <FilterButton items={items} onChange={onFilterChange}>
//       {(item, changeItem) => {
//         switch (item.id) {
//           case "dateOfLost": {
//             const value = item.value;
//             return (
//               <DateToDatePicker
//                 end={value?.end ?? null}
//                 onChange={(_value) => {
//                   changeItem(_value);
//                 }}
//                 start={value?.start ?? null}
//               />
//             );
//           }
//           case "lastUpdate": {
//             const value = item.value;
//             return (
//               <DateToDatePicker
//                 end={value?.end ?? null}
//                 onChange={(_value) => {
//                   changeItem(_value);
//                 }}
//                 start={value?.start ?? null}
//               />
//             );
//           }
//           case "attorney": {
//             const value = item.value;
//             return (
//               <Dropdown
//                 initialValue={value}
//                 items={lawFirms.map((firm, i) => ({ name: firm, id: i }))}
//                 onChange={(newItem) => {
//                   changeItem(newItem.id);
//                 }}
//               >
//                 Select
//               </Dropdown>
//             );
//           }
//         }
//       }}
//     </FilterButton>
//   );
// };



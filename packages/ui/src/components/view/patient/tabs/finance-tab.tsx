import type { Patient, PatientFinanceProvider } from "model/src/patient";
import { formatDollarAmount } from "model/src/utils";
import { useGetPatientFinanceProviders } from "../../../../services/patient";
import { Pill } from "../../../core/pill";
import type { TableGridColumn } from "../../../core/table-grid";
import { TableGrid } from "../../../core/table-grid";

export interface FinanceTabProps {
  patient: Patient;
}
export const FinanceTab: React.FunctionComponent<FinanceTabProps> = ({
  patient,
}) => {
  const query = useGetPatientFinanceProviders(patient.id);
  if (query.isError || query.isLoading) return <>Loading</>;

  const providers = query.data;

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
  const totalDue = providers.reduce(
    (prev, curr) => prev + (curr.status === "Unpaid" ? curr.amount : 0),
    0,
  );
  const footer = {
    name: <span className="font-medium text-black">Total Due</span>,
    status: "",
    amount: (
      <span className="font-medium text-black">
        {formatDollarAmount(totalDue)}
      </span>
    ),
  };

  const onItemClick = (_: PatientFinanceProvider): void => {
    alert("clicked"); //TODO: Make this functional
  };
  return (
    <div>
      <TableGrid
				columns={columns}
        data={providers}
        footer={footer}
        onItemClick={onItemClick}
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
			</TableGrid>
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

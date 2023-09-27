import { formatDollarAmount } from "model/src/utils"
import type { ReplaceWithName } from "model/src/core/utils"
import type { TableGridColumn, TableGridItem } from "../../../core/table-grid";
import { TableGrid } from "../../../core/table-grid"
import { Pill } from "../../../core/pill";

type FinanceProviderTableItem = ReplaceWithName<FinanceProvider, 'amount' | 'status', {
	amount: {compareKey: number, label: string},
	status: {compareKey: string, label: React.ReactNode}
} >
export const FinanceTab: React.FunctionComponent = () => {
	const providers: FinanceProvider[] = [
		{
			name: 'Joel Templeton',
			status: 'Paid',
			amount: 185.34
		},
		{
			name: 'Joel Templeton',
			status: 'Unpaid',
			amount: 200
		},
		{
			name: 'Joel Templeton',
			status: 'Unpaid',
			amount: 120.50
		},
		{
			name: 'Joel Templeton',
			status: 'Unpaid',
			amount: 75
		},
	]
	const items: TableGridItem<FinanceProviderTableItem>[] = providers.map(provider => ({
		...provider, 
		status: {compareKey: provider.status, label: <StatusPill status={provider.status}/>}, 
		amount: {compareKey: provider.amount, label: formatDollarAmount(provider.amount)}
	}));

	const columns: TableGridColumn<FinanceProviderTableItem>[] = [
		{
			id: 'name',
			label: 'Provider',
		},
		{
			id: 'status',
			label: 'Status'
		},
		{
			id: 'amount',
			label: 'Amount'
		}
	];
	const totalDue = providers.reduce((prev, curr) => prev + (curr.status === 'Unpaid' ? curr.amount : 0), 0);
	const footer = {
		name: <span className="font-medium text-black">Total Due</span>, 
		status: '', 
		amount: <span className="font-medium text-black">{formatDollarAmount(totalDue)}</span>
	}

	const onItemClick = (_: TableGridItem<FinanceProviderTableItem>): void => {
		alert('clicked') //TODO: Make this functional
	}
	return (
		<div>
			<TableGrid columns={columns} footer={footer} items={items} onItemClick={onItemClick}/>
		</div>
	)
}

const StatusPill: React.FunctionComponent<{status: string}> = ({status}) => {
	return (
		<Pill className="w-fit" mode={status === "Paid" ? 'success' : 'error'}>{status}</Pill>
	)
}

interface FinanceProvider {
	name: string,
	status: string,
	amount: number
}
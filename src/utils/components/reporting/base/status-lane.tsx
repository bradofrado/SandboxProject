import { DragOverlay, type UniqueIdentifier } from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { SortableContainer, SortableContainerContext, type SortableContainerItem } from "../../base/sortable-container"
import { ProgressBarMultiValue } from "./graphs/progressbar-multivalue"
import { type HexColor } from "~/utils/types/base/colors"
import Header from "../../base/header"
import React, { useState } from "react"
import { PieChart } from "./graphs/pie-chart"
import { ToggleButton } from "../../base/toggle-button"
import { type GraphComponent, type GraphValue } from "./graphs/base-graph"

export type StatusLane = {
	id: UniqueIdentifier,
	fill: HexColor,
	label: string
}
export type StatusLaneItem = SortableContainerItem & {
	amount: number
}
export type StatusLaneContainerProps<T extends StatusLaneItem> = {
	items: T[],
	setItems: React.Dispatch<(prevState: T[]) => T[]>,
	columns: StatusLane[],
	columnsToIncludeInProgressBar?: UniqueIdentifier[],
	children: (item: T, isDragging: boolean) => React.ReactNode
}
export const StatusLaneContainer = <T extends StatusLaneItem>({items, setItems, columns, columnsToIncludeInProgressBar, children}: StatusLaneContainerProps<T>) => {
	const [Graph, setGraph] = useState<GraphComponent>(() => ProgressBarMultiValue);
	
	const getItemAmount = (items: T[], columnIdFilter?: UniqueIdentifier) => {
		const filtered = columnIdFilter != undefined ? items.filter(item => item.columnId == columnIdFilter) : items;

		return filtered.reduce((prev, curr) => prev + curr.amount, 0);
	}

	const totalValue = getItemAmount(items);
	const values: GraphValue[] = columns.filter(column => columnsToIncludeInProgressBar ? columnsToIncludeInProgressBar.includes(column.id) : true).map(column => ({
		fill: column.fill,
		value: getItemAmount(items, column.id)
	}))

	return <>
		<SortableContainerContext items={items} setItems={setItems}>
			{({activeItem, items}) => 
			<div className="mt-5 flex flex-col gap-4">
				<Graph values={values} total={totalValue}/>
				<div className="mt-5 flex gap-4">
					{columns.map((column, i) => <>
						<StatusLane key={i} {...column} items={items.filter(item => item.columnId == column.id)}>
							{children}
						</StatusLane>
					</>)}
					{createPortal(<DragOverlay>
						{activeItem ? children(activeItem, false) : null}
					</DragOverlay>, document.body)}
				</div>
				<ToggleButton buttons={[{id: ProgressBarMultiValue, label: 'Progress Bar'}, {id: PieChart, label: 'Pie'}]} selected={Graph} setSelected={(selected) => setGraph(() => selected)}/>
			</div>}
		</SortableContainerContext>
	</>
}

export type StatusLaneProps<T extends SortableContainerItem> = {
	id: UniqueIdentifier,
	label: string,
	fill: HexColor,
	items: T[],
	children: (item: T, isDragging: boolean) => React.ReactNode
}
export const StatusLane = <T extends SortableContainerItem>({id, label, fill, items, children}: StatusLaneProps<T>) => {

	return <>
		<div className='flex flex-col gap-2 w-full min-h-[500px]'>
			<div className="h-[6px] rounded-lg" style={{backgroundColor: fill}}></div>
				<Header level={3}>{label}</Header>
				<div className={`flex flex-col gap-2 h-full`}>
					<SortableContainer id={id} items={items}>
						{(item) => (isDragging) => children(item, isDragging)}
					</SortableContainer>
				</div>
		</div>
	</>
}
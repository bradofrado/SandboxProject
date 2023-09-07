import { DragOverlay, type UniqueIdentifier } from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { SortableContainer, SortableContainerContext, type SortableContainerItem } from "../../base/sortable-container"
import { ProgressBarMultiValue, type ProgressBarValue } from "./progressbar-multivalue"
import { type HexColor } from "~/utils/types/base/colors"
import Header from "../../base/header"
import React from "react"
import { PieChart } from "./pie-chart"

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
	const getItemAmount = (items: T[], columnIdFilter?: UniqueIdentifier) => {
		const filtered = columnIdFilter != undefined ? items.filter(item => item.columnId == columnIdFilter) : items;

		return filtered.reduce((prev, curr) => prev + curr.amount, 0);
	}

	const totalValue = getItemAmount(items);
	const values: ProgressBarValue[] = columns.filter(column => columnsToIncludeInProgressBar ? columnsToIncludeInProgressBar.includes(column.id) : true).map(column => ({
		fill: column.fill,
		value: getItemAmount(items, column.id)
	}))

	return <>
		<SortableContainerContext items={items} setItems={setItems}>
			{({activeItem, items}) => 
			<div className="mt-5">
				<PieChart values={values} total={totalValue}/>
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
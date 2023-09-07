import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCenter, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { type NextPage } from "next";
import { useState } from "react";
import Button from "~/utils/components/base/button";
import { Card } from "~/utils/components/base/card";
import Header from "~/utils/components/base/header";
import { Pill } from "~/utils/components/base/pill";
import { ProfileImage } from "~/utils/components/profile/profile-image";
import { type HexColor } from "~/utils/types/base/colors";
import {CSS} from '@dnd-kit/utilities';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const ReportingPage: NextPage = () => {
	//const [values, setValues] = useState<ProgressBarValue[]>([{value: .25, fill: '#14b8a6'}, {value: .5, fill: '#1679d3'}]);
	const [items, setItems] = useState([{name: 'Bob Jones', description: 'thing', amount: 500, status: 'Follow up', profileImage: 'braydon.jpeg', id: 3, columnId: 0}, {name: 'Jennifer Jones', description: 'thing', amount: 2000, status: 'Follow up', profileImage: 'braydon.jpeg', id: 10, columnId: 0}, {name: 'Job Jones', description: 'thing', amount: 1000, status: 'Follow up', profileImage: 'braydon.jpeg', id: 5, columnId: 0}])
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const totalValue = items.reduce((prev, curr) => prev + curr.amount, 0);
	const values: ProgressBarValue[] = [
		{
			fill: '#14b8a6',
			value: items.filter(item => item.columnId == 1).reduce((prev, curr) => prev + curr.amount, 0) / totalValue
		},
		{
			fill: '#1679d3',
			value: items.filter(item => item.columnId == 2).reduce((prev, curr) => prev + curr.amount, 0) / totalValue
		}
	]

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id);
	}
	const handleDragEnd = () => {
		setActiveId(null);
	}

	const onDragOver = (event: DragOverEvent) => {
		const {active, over} = event;

		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
	
		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Item";
		const isOverATask = over.data.current?.type === "Item";

		if (!isActiveATask) return;

		if (isOverATask) {
			setItems((items) => {
				const activeIndex = items.findIndex(item => item.id == activeId);
				const overIndex = items.findIndex(item => item.id == overId);
				
				if (items[activeIndex].columnId != items[overIndex].columnId) {
					// Fix introduced after video recording
					items[activeIndex].columnId = items[overIndex].columnId;
					return arrayMove(items, activeIndex, overIndex - 1);
				}
		
				return arrayMove(items, activeIndex, overIndex);
			});
		} else {
			setItems((items) => {
				const activeIndex = items.findIndex((t) => t.id === activeId);
		
				items[activeIndex].columnId = overId;
				console.log("DROPPING TASK OVER COLUMN", { activeIndex });
				return arrayMove(items, activeIndex, activeIndex);
			  });
		}
	}
	return <>
		<div className="p-8">
			<Header level={1}>Reporting</Header>
			<DndContext sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={onDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={onDragOver}>
				<div className="mt-5">
					<ProgressBarMultiValue values={values}/>
					<div className="mt-5 flex gap-4">
						<StatusLane id={0} label="Nothing" fill="#e2e8f0" items={items.filter(item => item.columnId == 0)}/>
						<StatusLane id={1} label="Interested" fill="#14b8a6" items={items.filter(item => item.columnId == 1)}/>
						<StatusLane id={2} label="Committed" fill="#1679d3" items={items.filter(item => item.columnId == 2)}/>
						{createPortal(<DragOverlay>
							{activeId ? <ARClientCard {...items.find(item => item.id == activeId)} /> : null}
						</DragOverlay>, document.body)}
					</div>
				</div>
			</DndContext>
		</div>
	</>
}

interface SwimLaneItem {
	id: UniqueIdentifier,
	columnId: UniqueIdentifier,
	component: (isDragging: boolean) => React.ReactNode
}
type SwimLaneColumnType = {
	id: UniqueIdentifier,
	items: SwimLaneItem[]
}
const SwimLaneColumn = ({items, id}: SwimLaneColumnType) => {
	const {setNodeRef} = useDroppable({id, data: {type: 'Column'}});
	return <>
		<SortableContext 
			items={items.map(item => item.id)}
			strategy={verticalListSortingStrategy}
		>
			<div className="flex flex-col gap-2 w-96" ref={setNodeRef}>
				{items.map(item => <SortableItem key={item.id} id={item.id}>{item.component}</SortableItem>)}
			</div>
		</SortableContext>
	</>
}

type SortableItemType = {
	id: UniqueIdentifier,
	children: (isDragging: boolean) => React.ReactNode
}
const SortableItem = ({id, children}: SortableItemType) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({id, data: {type: 'Item'}});
	
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children(isDragging)}
		</div>
	);
  }

type ProgressBarValue = {
	value: number,
	fill: HexColor
}
type ProgressBarMultiValueProps = {
	values: ProgressBarValue[]
}
const ProgressBarMultiValue = ({values}: ProgressBarMultiValueProps) => {
	const sortedValues = values.sort((a, b) => a.value - b.value);
	let lastValue = 0;
	return <>
		<div className="h-3 rounded-lg overflow-hidden bg-slate-200 relative">
			{sortedValues.map(({value, fill}, i) => {
				const ret = <div className="bg-primary h-full w-full absolute transition-transform duration-1000 origin-left" key={i} style={{transform: `scaleX(${value}) translate(${(lastValue * 100 / (value || 1))}%, 0)`, backgroundColor: fill}}></div>
				lastValue = value;
				return ret;
			})}
		</div>
	</>
}

type StatusLaneProps = {
	id: UniqueIdentifier,
	label: string,
	fill: HexColor,
	items: ({
		id: UniqueIdentifier,
		columnId: UniqueIdentifier,
	} & ARClientCardProps)[]
}
const StatusLane = ({id, label, fill, items}: StatusLaneProps) => {
	return <>
		<div className='flex flex-col gap-2 w-full min-h-[500px]'>
			<div className="h-[6px] rounded-lg" style={{backgroundColor: fill}}></div>
				<Header level={3}>{label}</Header>
			<div className={`flex flex-col gap-2 h-full`}>
				<SwimLaneColumn id={id} items={items.map(({id, columnId, ...cardProps}) => ({id, columnId, component: (isDragging) => <ARClientCard outline={isDragging} {...cardProps}/>}))} />
			</div>
		</div>
	</>
}

type ARClientCardProps = {
	name: string,
	description: string,
	amount: number,
	status: string,
	profileImage: string,
}
const ARClientCard = ({name, description, amount, status, profileImage, outline}: ARClientCardProps & {outline: boolean}) => {
	if (outline) {
		return <Card className="h-[222px]"/>
	}
	const labelPill = <Pill>{status}</Pill>
	return <>
		<div >
		<Card items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={labelPill}>
			<Header level={5}>{name}</Header>
			<p>{description}</p>
			<div className="flex justify-between mt-2">
				<span className="text-3xl font-bold">{formatAmount(amount)}</span>
				<ProfileImage className="w-10 h-10" image={profileImage}/>
			</div>
		</Card>
		</div>
	</>
}

const formatAmount = (amount: number) => {
	let str = '';
	const amountStr = amount.toString();
	for (let i = amountStr.length - 1; i >= 0; i--) {
		const digit = amountStr[i] as string;
		str = digit + str;

		const digitCount = amountStr.length - i;
		if (i > 0 && digitCount % 3 == 0) {
			str = ',' + str;
		}
	}

	return '$' + str;
}

export default ReportingPage;
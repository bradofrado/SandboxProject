import { DndContext, type DragOverEvent, type DragStartEvent, KeyboardSensor, PointerSensor, type UniqueIdentifier, closestCenter, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { type Dispatch, useState } from "react";

export interface SortableContainerItem {
	id: UniqueIdentifier,
	columnId: UniqueIdentifier
}
export interface SortableContextProps<T extends SortableContainerItem> {
	items: T[],
	setItems: Dispatch<((prevState: T[]) => T[])>,
	children: ({activeItem, items}: {activeItem: T | undefined, items: T[]}) => React.ReactNode
}
export const SortableContainerContext = <T extends SortableContainerItem>({items, setItems, children}: SortableContextProps<T>) => {
	const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(undefined);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id);
	}
	const onDragEnd = () => {
		setActiveId(undefined);
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
				
				if (items[activeIndex]?.columnId != items[overIndex]?.columnId) {
					const activeItem = items[activeIndex];
					const overItem = items[overIndex];
					if (!activeItem || !overItem) {
						throw new Error(`Could not find active item with item ${activeId} or over item with id ${overId}`)
					}
					activeItem.columnId = overItem.columnId;
					return arrayMove(items, activeIndex, overIndex - 1);
				}
		
				return arrayMove(items, activeIndex, overIndex);
			});
		} else {
			setItems((items) => {
				const activeIndex = items.findIndex((t) => t.id === activeId);
		
				const item = items[activeIndex];
				if (!item) {
					throw new Error(`Could not find item with id ${activeId}`);
				}
				item.columnId = overId;

				return arrayMove(items, activeIndex, activeIndex);
			  });
		}
	}

	const activeItem = items.find(item => item.id == activeId);

	return <>
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
			{children({activeItem, items})}
		</DndContext>
	</>
}

export interface SortableContainerProps<T extends SortableContainerItem> {
	id: UniqueIdentifier,
	items: T[],
	children: (item: T) => (isDragging: boolean) => React.ReactNode
}
export const SortableContainer = <T extends SortableContainerItem>({id, items, children}: SortableContainerProps<T>) => {
	const {setNodeRef} = useDroppable({id, data: {type: 'Column'}});
	return <>
		<SortableContext 
			items={items.map(item => item.id)}
			strategy={verticalListSortingStrategy}
		>
			<div className="flex flex-col gap-2 w-96" ref={setNodeRef}>
				{items.map(item => <SortableItem key={item.id} id={item.id}>{children(item)}</SortableItem>)}
			</div>
		</SortableContext>
	</>
}

export interface SortableItemType {
	id: UniqueIdentifier,
	children: (isDragging: boolean) => React.ReactNode
}
export const SortableItem = ({id, children}: SortableItemType) => {
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
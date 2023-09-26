import React, { useState, type PropsWithChildren, useEffect } from "react"
import type { AllOrNothing } from "model/src/core/utils"
import { ChevronDownIcon, type IconComponent } from "./icons"
import { CheckboxInput } from "./input"
import { Button } from "./button"
import { Popover } from "./popover"

export type ListBoxProps<T> = {
	items: DropdownItem<T>[],
	className?: string,
	children: React.ReactNode,
	mode?: 'primary' | 'secondary',
	header?: React.ReactNode
} & AllOrNothing<{isOpen: boolean, setIsOpen: (value: boolean) => void}>
export const ListBox = <T,>({items, className, children, mode, header, ...isOpenStuff}: ListBoxProps<T>): JSX.Element => {
	const button = <Button className={className} mode={mode}>
		<div className="flex items-center">
			{children}
		</div>
	</Button>
	return (
		<Popover button={button} className='' {...isOpenStuff}>
			{header ? <div className="p-2 bg-gray-50">
				{header}
			</div> : null}
			<div className="min-w-[11rem]">
				<ul aria-labelledby="dropdownDefaultButton" className="text-sm text-gray-700 dark:text-gray-200">
					{items.map((item, i) => <li key={i}>
						{item.name}
					</li>)}
				</ul>
			</div>
		</Popover>
	)
}

export interface DropdownItem<T> {
	name: React.ReactNode,
	id: T
}
export type ItemAction<T> = (item: DropdownItem<T>, index: number) => void
interface DropdownProps<T> extends PropsWithChildren {
	items: DropdownItem<T>[],
	initialValue?: T,
	className?: string,
	chevron?: boolean,
	onChange?: ItemAction<T>,
}

export const Dropdown = <T,>({children, initialValue, onChange, items, chevron = true, className}: DropdownProps<T>): JSX.Element => {
	const [value, setValue] = useState<DropdownItem<T> | undefined>(items.find(x => x.id === initialValue));
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setValue(items.find(x => x.id === initialValue));
	}, [initialValue, items])
	
	const onClick = (item: DropdownItem<T>, index: number): void => {
		setValue(item);
		onChange && onChange(item, index)
		setIsOpen(false);
	}

	const dropdownItems: DropdownItem<T>[] = items.map((item, i) => ({...item, name: <button className={`${
		initialValue !== undefined && item === value ? 'bg-primary-light' : 'text-gray-900'
	} group flex w-full items-center rounded-md p-2 text-sm cursor-pointer hover:bg-gray-100 [&>*]:flex-1`} onClick={() => {onClick(item, i)}}type="button">{item.name}</button>}))
	
	return (
		<ListBox className={className} isOpen={isOpen} items={dropdownItems} mode={value === undefined ? 'secondary' : 'primary'} setIsOpen={setIsOpen}>
			{value === undefined ? children : value.name}	{chevron ? <ChevronDownIcon className="w-4 h-4 ml-1"/> : null}
		</ListBox>
	)
}

export interface ListItem {
	label: React.ReactNode,
	value: boolean
}

type ListItemProps<T> = (Omit<DropdownIconProps<T>, 'items'> | Omit<DropdownProps<T>, 'items'>) & {
	items: ListItem[],
	setItems: (items: ListItem[]) => void
}

export const DropdownList = <T,>({items, setItems, ...rest}: ListItemProps<T>): JSX.Element => {
	const copy = items.slice();
	const onSelect = (item: ListItem): void => {
		item.value = !item.value;
		setItems(copy);
	}
	const dropdownItems = copy.map((item) => ({ name: <DropdownListItem item={item}/>, id: undefined }))
	return 'icon' in rest ? 
		<DropdownIcon items={dropdownItems} {...rest} onChange={(item, index) => {onSelect(items[index])}}/> :
		<Dropdown items={dropdownItems} {...rest} onChange={(item, index) => {onSelect(items[index])}} />
}

export interface DropdownListItemProps {
	item: ListItem
}
export const DropdownListItem: React.FunctionComponent<DropdownListItemProps> = ({item}) => {
	return (
		<span className="flex items-center text-sm font-medium">
			<CheckboxInput className="mr-1" value={item.value}/>
			{item.label}
		</span>
	);
}

type DropdownIconProps<T> = Omit<DropdownProps<T>, "chevron"> & {
	icon: IconComponent,
}
export const DropdownIcon = <T,>({icon, className, ...rest}: DropdownIconProps<T>): JSX.Element => {
	const Icon = icon;
	return (
		<Dropdown className={`hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 ${className || ''}`} 
				{...rest} chevron={false}>
			<Icon className="h-5 w-5"/>
		</Dropdown>
	)
}
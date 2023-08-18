import { AllOrNothing } from "~/utils/types/utils"
import { TridotIcon } from "../icons/icons"
import { DropdownIcon, DropdownItem, ItemAction } from "./dropdown"

type CardDropdown = {
    items: DropdownItem<string>[],
    onChange: ItemAction<string>
}
export type CardProps = React.PropsWithChildren & {
    className?: string,
    label?: string
    items?: DropdownItem<string>[]
} & AllOrNothing<CardDropdown>
export const Card = ({children, className, label, items, onChange}: CardProps) => {
    return <>
        <div className={`${className || ''}bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700`}>
            <div className="flex justify-between px-4 pt-4 sm:px-8 sm:pt-8 items-center">
                <span className="text-sm font-medium">{label}</span>
                {items ? <DropdownIcon className="text-gray-500 dark:text-gray-400" icon={TridotIcon} items={items} onChange={onChange}/> : <div></div>}
                {/* <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                    <span className="sr-only">Open dropdown</span>
                    
                </button> */}
            </div>
            <div className="p-4 sm:p-8 pt-4 sm:pt-4">
                {children}
            </div>
        </div>
    </>
}
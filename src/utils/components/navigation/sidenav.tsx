import React from "react"
import { DashboardIcon, HamburgerIcon, UserIcon, UsersGroupIcon } from "../icons/icons"
import { useExpand } from "~/utils/hooks/useExpand"
import { SidePanel, type SidePanelItems } from "../base/side-panel"


export type SideNavComponentProps = {
    items: SidePanelItems[],
    className?: string
} & React.PropsWithChildren
export const SideNavComponent = ({children, items, className}: SideNavComponentProps) => {
    const {onExpand, expandClass} = useExpand('translate-x-0', '-translate-x-full');
    
    return <>
        <button aria-controls="default-sidebar" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => onExpand()}>
            <span className="sr-only">Open sidebar</span>
            <HamburgerIcon className="w-6 h-6"/>
        </button>

        <SidePanel items={items} className={`${className || ''} ${expandClass}`} onBodyClick={() => onExpand(false)}>
            {children}
        </SidePanel>
    </>
}

export type SideNavProps = {
    className?: string
} & React.PropsWithChildren
export const SideNav = ({children, className}: SideNavProps) => {
    const items: SidePanelItems[] = [
        {
            label: 'Patients',
            icon: UserIcon,
            href: {pathname: '/patients'}
        },
        {
            label: 'Partners',
            icon: UsersGroupIcon,
            href: {pathname: '/partners'}
        },
        {
            label: 'Reporting',
            icon: DashboardIcon,
            href: {pathname: '/reports'}
        },
    ]
    return <>
        <SideNavComponent className={className} items={items}>
            {children}
        </SideNavComponent>
    </>
}
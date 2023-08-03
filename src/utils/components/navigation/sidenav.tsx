import React from "react"
import { BagIcon, DashboardIcon, EditDocumentIcon, HamburgerIcon, IconComponent, MailboxIcon, SigninIcon, TilesIcon, UserIcon, UsersGroupIcon, UsersIcon } from "../icons.tsx/icons"
import { CogIcon } from "@heroicons/react/outline"
import Link from "next/link"
import { NotifyLabelProps, NotifyLabel } from "../base/notify-label"

export interface SideNavItems {
    label: string,
    icon?: IconComponent,
    href: string,
    notifyLabelItem?: NotifyLabelProps
}
export type SideNavProps = {
    items: SideNavItems[]
} & React.PropsWithChildren
export const SideNavComponent = ({children, items}: SideNavProps) => {
    return <>

    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
    <span className="sr-only">Open sidebar</span>
        <HamburgerIcon className="w-6 h-6"/>
    </button>

    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
            {items.map((item, i) => {
                const Icon = item.icon;
                return <>
                    <li key={i}>
                        <Link href={item.href} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            {Icon && <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>}
                            <span className="ml-3 flex-1">{item.label}</span>
                            {item.notifyLabelItem && <NotifyLabel {...item.notifyLabelItem}/>}
                        </Link>
                    </li>
                </>
            })}
        </ul>
    </div>
    </aside>

    <div className="p-4 sm:ml-64">
        {children}
    </div>

    </>
}

export const SideNav = ({children}: React.PropsWithChildren) => {
    const items: SideNavItems[] = [
        {
            label: 'Patients',
            icon: UserIcon,
            href: '/patients'
        },
        {
            label: 'Partners',
            icon: UsersGroupIcon,
            href: '/dashboard'
        },
        {
            label: 'Reporting',
            icon: DashboardIcon,
            href: '/dashboard'
        },
    ]
    return <>
        <SideNavComponent items={items}>
            {children}
        </SideNavComponent>
    </>
}
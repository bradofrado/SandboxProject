import React, { useState } from "react"
import { BagIcon, DashboardIcon, EditDocumentIcon, HamburgerIcon, IconComponent, MailboxIcon, SigninIcon, TilesIcon, UserIcon, UsersGroupIcon, UsersIcon } from "../icons.tsx/icons"
import { CogIcon } from "@heroicons/react/outline"
import Link from "next/link"
import { NotifyLabelProps, NotifyLabel } from "../base/notify-label"
import { useRouter } from "next/router"
import { useExpand } from "~/utils/hooks/useExpand"

export interface SideNavItems {
    label: string,
    icon?: IconComponent,
    href: string,
    notifyLabelItem?: NotifyLabelProps
}
export type SideNavComponentProps = {
    items: SideNavItems[],
    className?: string
} & React.PropsWithChildren
export const SideNavComponent = ({children, items, className}: SideNavComponentProps) => {
    const {onExpand, expandClass} = useExpand('translate-x-0', '-translate-x-full');
    const router = useRouter();

    return <>
        <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => onExpand()}>
            <span className="sr-only">Open sidebar</span>
            <HamburgerIcon className="w-6 h-6"/>
        </button>

        <aside id="default-sidebar" className={`${className || ''} fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 ${expandClass}`} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700">
                    <ul className="space-y-2 font-medium">
                        {items.map((item, i) => {
                            const Icon = item.icon;
                            const selected = router.asPath.includes(item.href);
                            return <>
                                <li key={i}>
                                    <Link href={item.href} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group aria-selected:bg-gray-300 dark:aria-selected:bg-gray-500" aria-selected={selected}>
                                        {Icon && <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:group-aria-selected:text-white"/>}
                                        <span className="ml-3 flex-1">{item.label}</span>
                                        {item.notifyLabelItem && <NotifyLabel {...item.notifyLabelItem}/>}
                                    </Link>
                                </li>
                            </>
                        })}
                    </ul>
                </div>
        </aside>

        <div className="p-4 sm:ml-64 dark:bg-gray-800 dark:text-white" onClick={() => onExpand(false)}>
            {children}
        </div>
    </>
}

export type SideNavProps = {
    className?: string
} & React.PropsWithChildren
export const SideNav = ({children, className}: SideNavProps) => {
    const items: SideNavItems[] = [
        {
            label: 'Patients',
            icon: UserIcon,
            href: '/patients'
        },
        {
            label: 'Partners',
            icon: UsersGroupIcon,
            href: '/partners'
        },
        {
            label: 'Reporting',
            icon: DashboardIcon,
            href: '/reports'
        },
    ]
    return <>
        <SideNavComponent className={className} items={items}>
            {children}
        </SideNavComponent>
    </>
}
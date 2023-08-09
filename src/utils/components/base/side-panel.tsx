import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import {NotifyLabel, type NotifyLabelProps} from '~/utils/components/base/notify-label';
import {type IconComponent} from '~/utils/components/icons.tsx/icons';

export interface SidePanelItems {
    label: string,
    icon?: IconComponent,
    href: {pathname: string, query?: undefined} | {query: ParsedUrlQueryInput, pathname?: undefined},
    notifyLabelItem?: NotifyLabelProps
}
export type SidePanelProps = {
    className?: string,
    items: SidePanelItems[],
    onBodyClick?: () => void,
} & React.PropsWithChildren
export const SidePanel = ({className, items, children, onBodyClick}: SidePanelProps) => {
    const router = useRouter();
    if (!router.isReady) return <></>
    
    const queryToString = (query: ParsedUrlQueryInput) => {
        return Object.entries(query).map(values => values.join('=')).join('&');
    }
    return <div className="flex">
        <div className={`${className || ''}  z-40 w-64 h-screen transition-transform sm:translate-x-0`}>
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                    <ul className="space-y-2 font-medium">
                        {items.map((item, i) => {
                            const Icon = item.icon;
                            const selected = router.asPath.includes(item.href.pathname ?? queryToString(item.href.query));
                            const link = item.href;
                            return <li key={i}>
                                    <Link href={link} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 group aria-selected:bg-gray-300 dark:aria-selected:bg-gray-500" aria-selected={selected}>
                                        {Icon && <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:group-aria-selected:text-white"/>}
                                        <span className="ml-3 flex-1">{item.label}</span>
                                        {item.notifyLabelItem && <NotifyLabel {...item.notifyLabelItem}/>}
                                    </Link>
                                </li>
                        })}
                    </ul>
                </div>
        </div>

        <div className="dark:bg-gray-800 dark:text-white flex-1" onClick={onBodyClick}>
            {children}
        </div>
    </div>
}
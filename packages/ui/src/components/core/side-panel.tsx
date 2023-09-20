import { type ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import { IconComponent } from './icons';
import { NotifyLabelProps, NotifyLabel } from './notify-label';

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
	path: string
} & React.PropsWithChildren
export const SidePanel = ({className, items, children, onBodyClick, path}: SidePanelProps) => {
    const queryToString = (query: ParsedUrlQueryInput) => {
        return Object.entries(query).map(values => values.join('=')).join('&');
    }
    return <div className="flex flex-1">
            <div className={`${className || ''}  z-40 w-64 h-screen transition-transform sm:translate-x-0`}>
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                        <ul className="space-y-2 font-medium">
                            {items.map((item, i) => {
                                const Icon = item.icon;
								const includesLink = item.href.pathname ?? queryToString(item.href.query);
                                const selected = path.includes(includesLink);
								const link = item.href.pathname ?? `${path.split('?')[0]}?${queryToString(item.href.query)}`;
                                return <li key={i}>
                                        <a aria-selected={selected} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-primary-light dark:hover:bg-primary-light group aria-selected:bg-primary-light dark:aria-selected:bg-primary-light" href={link}>
                                            {Icon && <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white group-aria-selected:text-primary dark:group-aria-selected:text-white"/>}
                                            <span className="ml-3 flex-1">{item.label}</span>
                                            {item.notifyLabelItem && <NotifyLabel {...item.notifyLabelItem}/>}
                                        </a>
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
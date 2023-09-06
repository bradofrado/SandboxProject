import { Tab } from '@headlessui/react'
import { useState } from 'react'

function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

export interface TabItem {
	label: string,
	component: React.ReactElement,
	id: string | number
}

type TabControlProps = {
	items: TabItem[],
    className?: string
}

export default function TabControl({items, className}: TabControlProps) {
	const [selected, setSelected] = useState<string | number>(items[0]?.id ?? -1);

	const selectedComponent = items.find(item => item.id == selected)?.component
	if (!selectedComponent) {
		throw new Error(`Could not find tab component with id ${selected}`);
	}

	const onTabSelect = (id: string | number) => {
		setSelected(id);
	}

    return (
        <div className={className}>
            <div className='text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
				<ul className="flex flex-wrap -mb-px">
					{items.map((item, i) => <li key={i} className="mr-2">
						<button className={classNames("inline-block p-4 border-b-2 rounded-t-lg", 
							selected == item.id ? 
								"text-primary border-b-2 border-primary rounded-t-lg active dark:text-primary-light dark:border-primary-light" : 
								"border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")}
							onClick={() => onTabSelect(item.id)}>
									{item.label}
						</button>
					</li>)}
				</ul>
			</div>
			<div className="mt-2">
				{selectedComponent}
			</div>
        </div>
    )
}

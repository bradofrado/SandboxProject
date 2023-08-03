import { useRouter } from "next/router";
import { UserIcon } from "../icons.tsx/icons"
import {UserCircleIcon} from '~/utils/components/icons.tsx/icons';
import Link from "next/link";

export interface NavItem {
    label: React.ReactNode,
    link: string
}

export type NavbarComponentProps = {
    items: NavItem[],
    title: string
}
export const NavbarComponent = ({items, title}: NavbarComponentProps) => {
    const router = useRouter();
    return <>
        <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-20">
            <div className="flex flex-wrap items-center justify-between w-full p-4 h-full">
                <a href="https://flowbite.com/" className="flex items-center">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{title}</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {items.map(item => {
                            const selected = router.asPath.includes(item.link); 
                            return <>
                                <li>
                                    <Link href={item.link} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent aria-selected:text-blue-700" aria-current="page" aria-selected={selected}>{item.label}</Link>
                                </li>
                            </>
                        })}
                    </ul>
                </div>
            </div>
        </nav>

    </>
}

export const Navbar = () => {
    const items: NavItem[] = [
        {
          label: <UserCircleIcon className="w-6 h-6"/>,
          link: '/profile'
        },
      ]
    return <>
        <NavbarComponent items={items} title="Sandbox Thing"/>
    </>
}
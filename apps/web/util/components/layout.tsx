import { useRouter } from "next/router";
import { NavbarComponent } from "ui/src/components/feature/navigation/navbar";
import { SideNavComponent } from "ui/src/components/feature/navigation/sidenav";
import { UserCircleIcon, UserIcon, UsersGroupIcon, DashboardIcon } from "ui/src/components/core/icons";
import type { SidePanelItems } from "ui/src/components/core/side-panel";
import type { NavItem } from "ui/src/components/feature/navigation/navbar";

export const Layout: React.FunctionComponent<React.PropsWithChildren> = ({children}) => {
	return <>
		<Navbar/>
		<SideNav className="top-20">
			{children}
		</SideNav>
	</>
}

const Navbar: React.FunctionComponent = () => {
	const router = useRouter();
    const items: NavItem[] = [
        {
          label: <UserCircleIcon className="w-6 h-6"/>,
          link: '/profile'
        },
      ]
    return (
        <NavbarComponent items={items} path={router.asPath} title="Nexa"/>
	)
}

type SideNavProps = {
    className?: string
} & React.PropsWithChildren
const SideNav: React.FunctionComponent<SideNavProps> = ({children, className}: SideNavProps) => {
	const router = useRouter();
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
    return <SideNavComponent className={className} items={items} path={router.asPath}>
            {children}
        </SideNavComponent>
}
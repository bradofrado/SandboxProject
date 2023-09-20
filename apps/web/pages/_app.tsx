import { type AppType } from "next/app";
import Head from 'next/head';
import "ui/styles.css";
import type { NavItem} from "ui/src/components/feature/navigation/navbar";
import { NavbarComponent } from "ui/src/components/feature/navigation/navbar";
import { SideNavComponent } from "ui/src/components/feature/navigation/sidenav";
import { DashboardIcon, UserCircleIcon, UserIcon, UsersGroupIcon } from "ui/src/components/core/icons";
import { useRouter } from "next/router";
import type { SidePanelItems } from "ui/src/components/core/side-panel";
import React from "react";
import { api } from "../util/api";

const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (<>
	<Head>
		<title>Create T3 App</title>
		<meta content="Generated by create-t3-app" name="description" />
		<link href="/favicon.ico" rel="icon" />
	</Head>
	<main className="flex min-h-screen flex-col">
		<Navbar/>
        <SideNav className="top-20">
          <Component {...pageProps} />
        </SideNav>
	</main>
	</>
  );
};

export const Navbar: React.FunctionComponent = () => {
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

export type SideNavProps = {
    className?: string
} & React.PropsWithChildren
export const SideNav: React.FunctionComponent<SideNavProps> = ({children, className}: SideNavProps) => {
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

export default api.withTRPC(MyApp);
import { useRouter } from "next/router";
import {
  UserIcon,
} from "ui/src/components/core/icons";
import type { ProfileItem, SidePanelItems } from "ui/src/components/core/side-panel";
import { SideNavComponent } from "ui/src/components/feature/navigation/sidenav";
import {ModalProvider} from 'ui/src/components/core/modal';
import {ClerkProvider, UserButton, useUser} from '@clerk/nextjs';
import { Header } from "ui/src/components/core/header";
import { inter } from "../fonts";

export const Layout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  return (
		<ClerkProvider>
			<ModalProvider>
				<SideNav className="top-20">{children}</SideNav>
			</ModalProvider>
		</ClerkProvider>
  );
};

// const Navbar: React.FunctionComponent = () => {
//   const router = useRouter();
//   const items: NavItem[] = [
//     {
//       label: <UserCircleIcon className="w-6 h-6" />,
//       link: "/profile",
//     },
//   ];
//   return <NavbarComponent items={items} path={router.asPath} title="Nexa" />;
// };

type SideNavProps = {
  className?: string;
} & React.PropsWithChildren;
const SideNav: React.FunctionComponent<SideNavProps> = ({
  children,
  className,
}: SideNavProps) => {
  const router = useRouter();
	const {user} = useUser();
  const items: SidePanelItems[] = [
    {
      label: "Clients",
      icon: UserIcon,
      href: "/clients",
			current: router.asPath.includes("clients")
    },
  ];
	const profileItem: ProfileItem | undefined = user ? {
		img: user.imageUrl,
		name: user.fullName ?? '',
		href: "/settings"
	} : undefined;
  return (
    <SideNavComponent className={className} titleClassName={inter.className} items={items} profileItem={profileItem} title="Nexa">
      {children}
    </SideNavComponent>
  );
};

const ProfileButton: React.FunctionComponent = () => {
	const {isLoaded, isSignedIn, user} = useUser();
	if (!isLoaded || !isSignedIn) {
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<Header level={3}>{user.fullName}</Header>
			<UserButton afterSignOutUrl="/"/>
		</div>
	)
}

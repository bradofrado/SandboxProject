import { useRouter } from "next/router";
import {
  UserIcon,
} from "ui/src/components/core/icons";
import type { SidePanelItems } from "ui/src/components/core/side-panel";
import { SideNavComponent } from "ui/src/components/feature/navigation/sidenav";
import {ModalProvider} from 'ui/src/components/core/modal';

export const Layout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  return (
		<ModalProvider>
    	<SideNav className="top-20">{children}</SideNav>
		</ModalProvider>
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
  const items: SidePanelItems[] = [
    {
      label: "Patients",
      icon: UserIcon,
      href: { pathname: "/patients" },
    },
  ];
  return (
    <SideNavComponent className={className} items={items} path={router.asPath} title="Nexa">
      {children}
    </SideNavComponent>
  );
};

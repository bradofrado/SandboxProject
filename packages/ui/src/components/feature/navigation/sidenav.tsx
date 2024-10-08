import { useExpand } from "../../../hooks/expand";
import { SidePanel, type SidePanelItems, type ProfileItem } from "../../core/side-panel";

export type SideNavComponentProps = {
  items: SidePanelItems[];
  className?: string;
  title?: string;
  profileItem?: ProfileItem
  titleClassName?: string;
} & React.PropsWithChildren;
export const SideNavComponent: React.FunctionComponent<
  SideNavComponentProps
> = ({ children, items, className, title, titleClassName, profileItem }) => {
  const { onExpand, expandClass } = useExpand(
    "translate-x-0",
    "-translate-x-full",
  );

  return (
		<SidePanel
			className={`${className || ""} ${expandClass}`}
			items={items}
			onBodyClick={() => {
				onExpand(false);
			}}
			profileItem={profileItem}
			title={"Client Soft"}
      titleClassName={titleClassName}
		>
			{children}
		</SidePanel>
  );
};

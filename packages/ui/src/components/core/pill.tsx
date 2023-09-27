export type PillMode = "primary" | "secondary" | "error" | "success";
export interface PillProps {
  children: string;
  className?: string;
  mode?: PillMode;
}
export const Pill: React.FunctionComponent<PillProps> = ({
  children,
  className,
  mode = "primary",
}) => {
  const backgrounds: Record<PillMode, string> = {
    primary: "bg-primary-light text-primary",
    secondary: "bg-white text-gray-800 border",
    error: "bg-red-300 text-red-600",
    success: "bg-[#2dd4bf33] text-[#14b8a6]",
  };
  const background = backgrounds[mode];
  return (
    <div
      className={`${
        className || ""
      } ${background} flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5`}
    >
      {children}
    </div>
  );
};

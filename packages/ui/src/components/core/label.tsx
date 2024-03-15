type LabelProps = {
  className?: string;
  label: string;
  sameLine?: boolean;
} & React.PropsWithChildren;
export const Label: React.FunctionComponent<LabelProps> = ({ children, className, label, sameLine }) => {
  return (
    <div
/** mt-[5px] */       className={`${className || ""} ${
        sameLine ? "flex items-center" : ""
      }`}
    >
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className={`${sameLine ? "ml-2" : "mt-2"} `}>{children}</div>
    </div>
  );
};

type LabelProps = {
    className?: string,
    label: string
} & React.PropsWithChildren;
const Label = ({children, className, label}: LabelProps) => {
    return <div className={className}>
        <label className="block text-sm font-medium">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
}

export default Label;
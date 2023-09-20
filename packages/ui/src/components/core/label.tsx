type LabelProps = {
    className?: string,
    label: string,
    sameLine?: boolean
} & React.PropsWithChildren;
export const Label = ({children, className, label, sameLine}: LabelProps) => {
    return <div className={`${className || ''} ${sameLine ? 'flex items-center justify-between' : ''}`}>
        <label className="block text-sm font-medium">{label}</label>
        <div className={sameLine ? 'ml-1' : 'mt-1'}>{children}</div>
    </div>
}
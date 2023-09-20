export interface PillProps {
    children: string,
    className?: string
}
export const Pill = ({children, className}: PillProps) => {
    return <>
      <div className={`${className || ''} flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium leading-5 text-primary`}>{children}</div>
    </>
  }
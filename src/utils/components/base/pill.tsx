export type PillProps = {
    children: string,
    className?: string
  }
export const Pill = ({children, className}: PillProps) => {
    return <>
      <div className={`${className || ''} flex items-center rounded-full bg-teal-400/20 px-3 py-1 text-xs font-medium leading-5 text-teal-500`}>{children}</div>
    </>
  }
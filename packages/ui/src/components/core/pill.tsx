export interface PillProps {
	children: string,
	className?: string,
	mode?: 'primary' | 'secondary'
}
export const Pill: React.FunctionComponent<PillProps> = ({children, className, mode='primary'}) => {
	const backgrounds = {
		'primary': 'bg-primary-light text-primary',
		'secondary': 'bg-white text-gray-800 border'
	}
	const background = backgrounds[mode];
	return (
		<div className={`${className || ''} ${background} flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5`}>{children}</div>
	)
}
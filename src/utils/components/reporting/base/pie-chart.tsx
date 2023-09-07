import { type ProgressBarValue } from "./progressbar-multivalue"

export type PieChartProps = {
	values: ProgressBarValue[],
	total: number,
	width?: number,
	height?: number
}
export const PieChart = ({values, total, width=100, height=100}: PieChartProps) => {
	let currValue = 0;
	const sortedValues = values.sort((a, b) => a.value - b.value).map((value, i) => i > 0 ? ({...value, value: value.value + (values[i - 1] as ProgressBarValue).value}): value).sort((a, b) => b.value - a.value);
	return <>
		<svg width={width} height={height} className="rounded-full bg-slate-200 -rotate-90" viewBox="0 0 32 32">
			<circle className="fill-slate-200" r="16" cx="16" cy="16"/>
			{sortedValues.map(({value: absoluteValue, fill}, i) => {
				const value = absoluteValue / total;
				currValue = value;
				return <circle key={i} className="fill-transparent transition duration-1000" strokeDasharray={`${currValue * 100} 100`} strokeWidth="32" r="16" cx="16" cy="16" style={{transitionProperty: 'stroke-dasharray', stroke: fill}}/>
			})}
		</svg>
	</>
}
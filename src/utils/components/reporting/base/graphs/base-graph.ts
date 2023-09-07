import { type HexColor } from "~/utils/types/base/colors";

export interface GraphValue {
	value: number,
	fill: HexColor
}

export type GraphComponentProps = {
	values: GraphValue[],
	total: number
}
export type GraphComponent = (props: GraphComponentProps) => JSX.Element
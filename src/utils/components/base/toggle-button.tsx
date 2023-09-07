import Button from "./button"

export type ToggleButtonType = {
	buttons: {
		id: number,
		label: string
	}[],
	selected: number,
	setSelected: (selected: number) => void
}
export const ToggleButton = ({buttons, selected, setSelected}: ToggleButtonType) => {
	return <>
		<div className="flex">
			{buttons.map((button, i) => <Button key={i} mode={selected == button.id ? 'primary' : 'secondary'} onClick={() => setSelected(button.id)}>{button.label}</Button>)}
		</div>
	</>
}
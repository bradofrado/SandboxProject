import { type NextPage } from "next";
import { useState } from "react";
import { Card } from "~/utils/components/base/card";
import Header from "~/utils/components/base/header";
import { Pill } from "~/utils/components/base/pill";
import { ProfileImage } from "~/utils/components/profile/profile-image";
import { type HexColor } from "~/utils/types/base/colors";
import { StatusLaneContainer } from "~/utils/components/reporting/base/status-lane";
import { formatDollarAmount } from "~/utils/utils";
import { PieChart } from "~/utils/components/reporting/base/pie-chart";
import Button from "~/utils/components/base/button";


interface ARClient {
	id: number,
	columnId: number,
	name: string,
	description: string,
	amount: number,
	status: string,
	profileImage: string
}

interface ARCategory {
	id: number,
	label: string,
	fill: HexColor
}

const ReportingPage: NextPage = () => {
	const [items, setItems] = useState<ARClient[]>([{name: 'Bob Jones', description: 'thing', amount: 500, status: 'Follow up', profileImage: 'braydon.jpeg', id: 3, columnId: 0}, {name: 'Jennifer Jones', description: 'thing', amount: 2000, status: 'Follow up', profileImage: 'braydon.jpeg', id: 10, columnId: 0}, {name: 'Job Jones', description: 'thing', amount: 1000, status: 'Follow up', profileImage: 'braydon.jpeg', id: 5, columnId: 0}])
	const [value, setValue] = useState(.5);
	
	const columns: ARCategory[] = [
		{
			id: 0,
			label: 'Nothing',
			fill: '#e2e8f0'
		},
		{
			id: 1,
			label: 'Interested',
			fill: '#14b8a6'
		},
		{
			id: 2,
			label: 'Committed',
			fill: '#1679d3'
		},
	];

	// Include every column except the first one in the progress bar
	const columnsToIncludeInProgressBar = columns.filter(column => column.id > 0).map(column => column.id);

	return <>
		<div className="p-8">
			<Header level={1}>Reporting</Header>
			<StatusLaneContainer items={items} setItems={setItems} columns={columns} columnsToIncludeInProgressBar={columnsToIncludeInProgressBar} >
				{(item, isDragging) => <ARClientCard {...item} outline={isDragging} />}
			</StatusLaneContainer>

			<Button onClick={() => setValue(.75)}>Click Me</Button>
		</div>
	</>
}


type ARClientCardProps = Omit<ARClient, 'id' | 'columnId'> & {
	outline: boolean
}
const ARClientCard = ({name, description, amount, status, profileImage, outline}: ARClientCardProps) => {
	if (outline) {
		return <Card className="h-[222px]"/>
	}
	const labelPill = <Pill>{status}</Pill>
	return <>
		<div >
		<Card items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={labelPill}>
			<Header level={5}>{name}</Header>
			<p>{description}</p>
			<div className="flex justify-between mt-2">
				<span className="text-3xl font-bold">{formatDollarAmount(amount)}</span>
				<ProfileImage className="w-10 h-10" image={profileImage}/>
			</div>
		</Card>
		</div>
	</>
}

export default ReportingPage;
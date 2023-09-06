import { type NextPage } from "next";
import { useState } from "react";
import Button from "~/utils/components/base/button";
import { Card } from "~/utils/components/base/card";
import Header from "~/utils/components/base/header";
import { Pill } from "~/utils/components/base/pill";
import { ProfileImage } from "~/utils/components/profile/profile-image";
import { HexColor } from "~/utils/types/base/colors";

const ReportingPage: NextPage = () => {
	const [values, setValues] = useState<ProgressBarValue[]>([{value: .25, fill: '#14b8a6'}, {value: .5, fill: '#1679d3'}]);

	return <>
		<div className="p-8">
			<Header level={1}>Reporting</Header>
			<div className="mt-5">
				<ProgressBarMultiValue values={values}/>
				<div className="mt-5 flex gap-4">
					<StatusLane label="Interested" fill="#14b8a6"/>
					<StatusLane label="Committed" fill="#1679d3"/>
				</div>
			</div>
			<Button onClick={() => setValues([{value: .25, fill: '#14b8a6'}, {value: Math.random(), fill: '#1679d3'}])}>Random</Button>
		</div>
	</>
}

type ProgressBarValue = {
	value: number,
	fill: HexColor
}
type ProgressBarMultiValueProps = {
	values: ProgressBarValue[]
}
const ProgressBarMultiValue = ({values}: ProgressBarMultiValueProps) => {
	const sortedValues = values.slice().sort((a, b) => b.value - a.value);
	return <>
		<div className="h-3 rounded-lg overflow-hidden bg-slate-200 relative">
			{sortedValues.map(({value, fill}, i) => 
				<div className="bg-primary h-full w-full absolute transition-transform duration-1000 origin-left" key={i} style={{transform: `scaleX(${value})`, backgroundColor: fill}}></div>)}
		</div>
	</>
}

type StatusLaneProps = {
	label: string,
	fill: HexColor
}
const StatusLane = ({label, fill}: StatusLaneProps) => {
	return <>
		<div className="flex flex-col gap-2 w-full">
			<div className="h-[6px] rounded-lg" style={{backgroundColor: fill}}></div>
			<Header level={3}>{label}</Header>
			<ARClientCard name="Bob Jones" description="Person thing" amount={1000} status="Follow up" profileImage="braydon.jpeg"/>
		</div>
	</>
}

type ARClientCardProps = {
	name: string,
	description: string,
	amount: number,
	status: string,
	profileImage: string
}
const ARClientCard = ({name, description, amount, status, profileImage}: ARClientCardProps) => {
	const labelPill = <Pill>{status}</Pill>
	return <>
		<Card items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={labelPill}>
			<Header level={5}>{name}</Header>
			<p>{description}</p>
			<div className="flex justify-between mt-2">
				<span className="text-3xl font-bold">{formatAmount(amount)}</span>
				<ProfileImage className="w-10 h-10" image={profileImage}/>
			</div>
		</Card>
	</>
}

const formatAmount = (amount: number) => {
	let str = '';
	const amountStr = amount.toString();
	for (let i = amountStr.length - 1; i >= 0; i--) {
		const digit = amountStr[i] as string;
		str = digit + str;

		const digitCount = amountStr.length - i;
		if (i > 0 && digitCount % 3 == 0) {
			str = ',' + str;
		}
	}

	return '$' + str;
}

export default ReportingPage;
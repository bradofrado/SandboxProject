import { type NextPage } from "next";
import { Card } from "~/utils/components/base/card";
import Header from "~/utils/components/base/header";
import { Pill } from "~/utils/components/base/pill";
import { ProfileImage } from "~/utils/components/profile/profile-image";

const ReportingPage: NextPage = () => {
	return <>
		<div className="p-8">
			<Header level={1}>Reporting</Header>
			<div className="mt-5 flex gap-4">
				<div className="flex flex-col gap-2 w-full">
					<div className="h-1 rounded-lg bg-primary"></div>
					<Header level={3}>INTERESTED</Header>
					<Card items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={<Pill>Follow up</Pill>}>
						<Header level={5}>Bob Jones</Header>
						<p>Person ting</p>
						<div className="flex justify-between mt-2">
							<span className="text-3xl font-bold">$1,000</span>
							<ProfileImage className="w-10 h-10" image="braydon.jpeg"/>
						</div>
					</Card>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<div className="h-1 rounded-lg bg-slate-500"></div>
					<Header level={3}>COMMITTED</Header>
					<Card items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={<Pill>Follow up</Pill>}>
						<Header level={5}>Bob Jones</Header>
						<p>Person ting</p>
						<div className="flex justify-between mt-2">
							<span className="text-3xl font-bold">$1,000</span>
							<ProfileImage className="w-10 h-10" image="braydon.jpeg"/>
						</div>
					</Card>
				</div>
			</div>
		</div>
	</>
}

export default ReportingPage;
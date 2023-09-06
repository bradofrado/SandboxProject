import { type NextPage } from "next";
import { Card } from "~/utils/components/base/card";
import Header from "~/utils/components/base/header";
import { Pill } from "~/utils/components/base/pill";
import { ProfileImage } from "~/utils/components/profile/profile-image";

const ReportingPage: NextPage = () => {
	return <>
		<div className="p-8">
			<Header level={1}>Reporting</Header>
			<div className="mt-5">
				<Card className="max-w-xs" items={[{name: 'Edit', id: '0'}]} onChange={() => undefined} label={<Pill>Follow up</Pill>}>
					<Header level={5}>Bob Jones</Header>
					<p>Person ting</p>
					<div className="flex justify-between mt-2">
						<span className="text-3xl font-bold">$1,000</span>
						<ProfileImage className="w-10 h-10" image="braydon.jpeg"/>
					</div>
				</Card>
			</div>
		</div>
	</>
}

export default ReportingPage;
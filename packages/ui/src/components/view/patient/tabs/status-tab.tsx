import dayjs from "dayjs";
import type { Patient } from "model/src/patient"
import { Card } from "../../../core/card";
import { Calendar } from "../../../core/date-picker";
import { Label } from "../../../core/label";
import { StatusTracker } from "../../../feature/status-tracker";

export interface StatusTabProps {
	patient: Patient
}
export const StatusTab: React.FunctionComponent<StatusTabProps> = ({patient}) => {
	const statuses = ['File Setup', 'Treatment', 'Demand', 'Negotiation', 'Settlement']

	return (
		<div className="flex flex-col gap-4 py-2">
			<StatusTracker className="h-20" statuses={statuses} value="Treatment"/>
			<Card className="mt-5">
				<div className="flex gap-4">
					<Calendar value={new Date()}/>
					<Label label="Apointments">
						<ul>
							{patient.appointments.map((appointment, i) => {
								const day = dayjs(appointment);
								return <li key={i}>
									<div className="rounded-lg hover:bg-primary-light py-1 px-2">
										<Label label={day.format('ddd, MMM DD')} sameLine>
											{day.format('hh:mm a')}
										</Label>
									</div>
								</li>
							})}
						</ul>
					</Label>
				</div>
			</Card>
		</div>
	)
}
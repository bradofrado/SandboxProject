import { type User } from "model/src/user";
import { displayDate, displayRelativeDate, groupBy } from "model/src/utils";
import type { Message } from "model/src/message";
import { MessageProvider } from "../../../services/message";
import { Pill } from "../../core/pill";
import { ChatMessage } from "./message";
import { SendMessage } from "./send-message";

export interface ChatBoxProps {
  user: User;
	className?: string;
	chatId: string;
}
export const ChatBox: React.FunctionComponent<ChatBoxProps> = ({ user, className, chatId }) => {
  return (
    <MessageProvider chatId={chatId}>
      {(messages) => {
				const groupedByTime = groupBy(messages.map(message => ({...message, day: displayDate(message.date)})), 'day');
				return (
					<div className={`${className} flex flex-col max-h-screen dark:bg-[#282a2d]`}>
						<div className="p-8 mb-15 flex-col gap-2 flex-1 justify-end overflow-auto">
							{Object.entries(groupedByTime).map(([date, messages]) => (
								<MessageDateSegment date={date} key={date} messages={messages} user={user}/>
							))}
						</div>
						<SendMessage user={user} />
					</div>
				)
			}}
    </MessageProvider>
  );
}

interface MessageDateSegmentProps {
	messages: Message[],
	date: string,
	user: User
}
const MessageDateSegment: React.FunctionComponent<MessageDateSegmentProps> = ({messages, date, user}) => {
	const dateReal = new Date(date);
	return (
		<div className="flex flex-col gap-2">
			<div className="my-4">
				<Pill className="w-fit mx-auto" mode='secondary'>{displayRelativeDate(dateReal)}</Pill>
			</div>
			{messages.map(message => <ChatMessage
					isUser={message.userId === user.id}
					key={message.id}
					message={message}
				/>)}
		</div>
	)
}

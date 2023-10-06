import { createContext, useContext, useState } from "react";
import { Chat, type Message } from "model/src/message";
import { type User } from "model/src/user";
import { calculateDateDifference, day, hour, minute } from "model/src/utils";

export type MessageContextType = [
  Message[],
  (chatId: string, message: string, user: User) => void,
];
export const MessageContext = createContext<MessageContextType>([
  [],
  () => undefined,
]);

export interface MessageProviderProps {
  children: (messages: Message[], sendMessage: (chatId: string, message: string, user: User) => void) => React.ReactNode;
	chatId: string
}
export const MessageProvider: React.FunctionComponent<MessageProviderProps> = ({ children, chatId }) => {
  const [chats, setChats] = useState<Chat[]>(_chats);
  const sendMessage = (_chatId: string, message: string, user: User): void => {
		const copyChats = [...chats];
    const currIndex = copyChats.findIndex(chat => chat.id === _chatId);
		if (currIndex < 0) throw new Error('Cannot send message to chat ' + _chatId);
		const copy = [...copyChats[currIndex].messages];
    copy.push({
      id: "3",
      userId: user.id,
      name: user.name,
      text: message,
      avatar: user.image,
			date: new Date()
    });
		copyChats[currIndex].messages = copy;
    setChats(copyChats);
  };
	const chat = chats.find(chat => chat.id === chatId);
	if (!chat) throw new Error('Invalid chat id');

	const sorted = chat.messages.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
  return (
    <MessageContext.Provider value={[sorted, sendMessage]}>
      {children(sorted, sendMessage)}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  return useContext(MessageContext);
};

const _chats: Chat[] = [
  {
    id: "0",
    name: 'Threads',
		messages: [
			{
				id: "0",
				userId: "0",
				name: "Spinal Rehab",
				text: "Not sure if you saw the notification under status but Maria missed her appointment yesterday at Spinal Rehab",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour)
			},
			{
				id: "1",
				userId: "1",
				name: "Jeremy Richards",
				text: "Saw that. I will reach out to Maria.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour - 33 * minute)
			},
			{
				id: "2",
				userId: "0",
				name: "Spinal Rehab",
				text: "Thanks for reaching out to her! She was seen yesterday at spinal rehab.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 7 * hour)
			},
			{
				id: "3",
				userId: "1",
				name: "Jeremy Richards",
				text: "Awesome! Let me know if there is anything else we can do to help!",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 3 * hour)
			},
		]
  },
  {
    id: "1",
    name: 'Threads',
		messages: [
			{
				id: "0",
				userId: "0",
				name: "Spinal Rehab",
				text: "Layne is all finished with treatment, could you update the demands?",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(1 * day + 7 * hour)
			},
			{
				id: "1",
				userId: "1",
				name: "Clint Peterson",
				text: "Yes, I have already begun that process and I'll let you know when I'm done.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 7 * hour - 33 * minute)
			},
			{
				id: "2",
				userId: "0",
				name: "Spinal Rehab",
				text: "Ok awesome, thanks so much!",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(15 * hour)
			},
		]
  },
  {
    id: "2",
    name: 'Threads',
		messages: [
			{
				id: "0",
				userId: "0",
				name: "Spinal Rehab",
				text: "Not sure if you saw the notification under status but Maria missed her appointment yesterday at Spinal Rehab",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour)
			},
			{
				id: "1",
				userId: "1",
				name: "Jeremy Richards",
				text: "Saw that. I will reach out to Maria.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour - 33 * minute)
			},
			{
				id: "2",
				userId: "0",
				name: "Spinal Rehab",
				text: "Thanks for reaching out to her! She was seen yesterday at spinal rehab.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 7 * hour)
			},
			{
				id: "3",
				userId: "1",
				name: "Jeremy Richards",
				text: "Awesome! Let me know if there is anything else we can do to help!",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 3 * hour)
			},
		]
  },
  {
    id: "3",
    name: 'Threads',
		messages: [
			{
				id: "0",
				userId: "0",
				name: "Spinal Rehab",
				text: "Not sure if you saw the notification under status but Maria missed her appointment yesterday at Spinal Rehab",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour)
			},
			{
				id: "1",
				userId: "1",
				name: "Jeremy Richards",
				text: "Saw that. I will reach out to Maria.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour - 33 * minute)
			},
			{
				id: "2",
				userId: "0",
				name: "Spinal Rehab",
				text: "Thanks for reaching out to her! She was seen yesterday at spinal rehab.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 7 * hour)
			},
			{
				id: "3",
				userId: "1",
				name: "Jeremy Richards",
				text: "Awesome! Let me know if there is anything else we can do to help!",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 3 * hour)
			},
		]
  },
  {
    id: "4",
    name: 'Threads',
		messages: [
			{
				id: "0",
				userId: "0",
				name: "Spinal Rehab",
				text: "Not sure if you saw the notification under status but Maria missed her appointment yesterday at Spinal Rehab",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour)
			},
			{
				id: "1",
				userId: "1",
				name: "Jeremy Richards",
				text: "Saw that. I will reach out to Maria.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(2 * day + 7 * hour - 33 * minute)
			},
			{
				id: "2",
				userId: "0",
				name: "Spinal Rehab",
				text: "Thanks for reaching out to her! She was seen yesterday at spinal rehab.",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 7 * hour)
			},
			{
				id: "3",
				userId: "1",
				name: "Jeremy Richards",
				text: "Awesome! Let me know if there is anything else we can do to help!",
				avatar: "/jeremy.jpeg",
				date: calculateDateDifference(day + 3 * hour)
			},
		]
  },
];

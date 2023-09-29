import { createContext, useContext, useState } from "react";
import { type Message } from "model/src/message";
import { type User } from "model/src/user";
import { calculateDateDifference, day, hour, minute } from "model/src/utils";

export type MessageContextType = [
  Message[],
  (message: string, user: User) => void,
];
export const MessageContext = createContext<MessageContextType>([
  [],
  () => undefined,
]);

export interface MessageProviderProps {
  children: (messages: Message[]) => React.ReactNode;
}
export const MessageProvider: React.FunctionComponent<MessageProviderProps> = ({ children }) => {
  const [_messages, setMessages] = useState<Message[]>(messages);
  const sendMessage = (message: string, user: User): void => {
    const copy = [..._messages];
    copy.push({
      id: "3",
      userId: user.id,
      name: user.name,
      text: message,
      avatar: user.image,
			date: new Date()
    });
    setMessages(copy);
  };
	const sorted = _messages.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
  return (
    <MessageContext.Provider value={[sorted, sendMessage]}>
      {children(sorted)}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessageContext);
};

const messages: Message[] = [
  {
    id: "0",
    userId: "0",
    name: "Bob",
    text: "Not sure if you saw the notification under status but Maria missed her appointment yesterday at Spinal Rehab",
    avatar: "/braydon.jpeg",
		date: calculateDateDifference(2 * day + 7 * hour)
  },
  {
    id: "1",
    userId: "1",
    name: "John",
    text: "Saw that. I will reach out to Maria.",
    avatar: "/braydon.jpeg",
		date: calculateDateDifference(2 * day + 7 * hour - 33 * minute)
  },
	{
    id: "2",
    userId: "0",
    name: "Bob",
    text: "Thanks for reaching out to her! She was seen yesterday at spinal rehab.",
    avatar: "/braydon.jpeg",
		date: calculateDateDifference(day + 7 * hour)
  },
	{
    id: "3",
    userId: "1",
    name: "John",
    text: "Awesome! Let me know if there is anything else we can do to help!",
    avatar: "/braydon.jpeg",
		date: calculateDateDifference(day + 3 * hour)
  },
];

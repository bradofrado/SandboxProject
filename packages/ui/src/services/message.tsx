import { createContext, useContext, useState } from "react";
import { type Message } from "model/src/message";
import { type User } from "model/src/user";

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
export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [_messages, setMessages] = useState<Message[]>(messages);
  const sendMessage = (message: string, user: User) => {
    const copy = [..._messages];
    copy.push({
      id: "3",
      userId: user.id,
      name: user.name,
      text: message,
      avatar: user.image,
    });
    setMessages(copy);
  };
  return (
    <MessageContext.Provider value={[_messages, sendMessage]}>
      {children(_messages)}
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
    text: "Hello there john",
    avatar: "/braydon.jpeg",
  },
  {
    id: "1",
    userId: "1",
    name: "John",
    text: "Hello there bob",
    avatar: "/braydon.jpeg",
  },
];

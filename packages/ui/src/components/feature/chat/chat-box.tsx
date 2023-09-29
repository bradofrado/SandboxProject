import { type User } from "model/src/user";

import { MessageProvider } from "../../../services/message";
import { ChatMessage } from "./message";
import { SendMessage } from "./send-message";

export interface ChatBoxProps {
  user: User;
	className?: string;
}
export const ChatBox: React.FunctionComponent<ChatBoxProps> = ({ user, className }) => {
  return (
    <MessageProvider>
      {(messages) => (
        <div className={`${className} flex flex-col max-h-screen dark:bg-[#282a2d] overflow-auto`}>
          <div className="p-8 mb-15 flex flex-col gap-2 flex-1 justify-end">
            {messages.map((message) => (
              <ChatMessage
                isUser={message.userId === user.id}
                key={message.id}
                message={message}
              />
            ))}
          </div>
          <SendMessage user={user} />
        </div>
      )}
    </MessageProvider>
  );
}

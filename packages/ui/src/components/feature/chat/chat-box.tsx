import { type User } from "model/src/user";

import { MessageProvider } from "../../../services/message";
import { ChatMessage } from "./message";
import { SendMessage } from "./send-message";

export interface ChatBoxProps {
  user: User;
}
export function ChatBox({ user }: ChatBoxProps) {
  return (
    <MessageProvider>
      {(messages) => (
        <div className="dark:bg-[#282a2d] max-h-[500px] overflow-auto">
          <div className="p-8 mb-15 flex flex-col gap-2">
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

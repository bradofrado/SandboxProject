import React from "react";
import { ProfileImage } from "../profile/profile-image";
import { type Message } from "~/utils/types/message";

export type ChatMessageProps = {
    message: Message,
    isUser: boolean
}
const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div className={`flex mb-5  gap-1 items-center p-4 w-[max-content] max-w-[calc(100% - 50px)] shadow-sm ${isUser ? "ml-auto rounded-t-3xl rounded-l-3xl bg-white" : "bg-primary rounded-r-3xl rounded-t-3xl"}`}>
      <ProfileImage image={message.avatar} className="w-9 h-9"/>
      <div>
        <p className="font-medium mb-1 text-sm">{message.name}</p>
        <p className="break-all">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
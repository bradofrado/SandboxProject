import React from "react";
import { useAuth } from "~/utils/services/auth";
import { ProfileImage } from "../profile/profile-image";

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

export interface Message {
  id: string,
  userId: string,
  avatar: string,
  name: string,
  text: string
}

export default ChatMessage;
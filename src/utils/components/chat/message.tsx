import React from "react";
import { ProfileImage } from "../profile/profile-image";
import { type Message } from "~/utils/types/message";

export type ChatMessageProps = {
    message: Message,
    isUser: boolean
}
const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return <>
  <div className={`flex flex-col gap-1 w-[max-content] ${isUser ? 'ml-auto': ''}`}>
    <div className="flex items-center gap-2">
      {!isUser && <ProfileImage image={message.avatar} className="w-9 h-9"/>}
      <div className={` rounded-3xl ${isUser ? 'rounded-br-sm bg-[#00000066]': 'bg-[#343434] rounded-bl-sm'}`}>
        
        <div className="text-white py-2 px-4">
          <p className="break-all">{message.text}</p>
        </div>
      </div>
    </div>
    <div className={`text-[#72767e] text-sm ${isUser ? '' : 'ml-10'}`}>
      <span>{!isUser ? message.name: ''} Today at 2:06 pm</span>
    </div>
    </div>
  </>
};

export default ChatMessage;
import React from "react";
import { ProfileImage } from "../profile/profile-image";
import { type Message } from "~/utils/types/message";

export type ChatMessageProps = {
    message: Message,
    isUser: boolean
}
const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
    return <>
        <div className={`flex gap-2 w-[max-content] ${isUser ? 'ml-auto': ''}`}>
            {!isUser && <ProfileImage image={message.avatar} className="w-9 h-9 mt-1"/>}
            <div className="flex flex-col gap-2">
                
              <div className={`rounded-3xl ${isUser ? 'rounded-br-sm bg-primary': 'dark:bg-[#343434] border border-[#ecebeb] rounded-bl-sm'}`}>  
                  <div className={`${isUser ? 'text-white' : ''} py-2 px-4`}>
                      <p className="break-all">{message.text}</p>
                  </div>
              </div>
              <div className={`text-[#72767e] text-sm ${isUser ? 'self-end' : ''}`}>
                  <span>{!isUser ? message.name: ''} Today at 2:06 pm</span>
              </div>
            </div>
        </div>
    </>
};

export default ChatMessage;
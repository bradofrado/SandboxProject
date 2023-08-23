import React from "react";
import ChatMessage from "./message";
import { SendMessage } from "./send-message";
import { type User } from "~/utils/types/auth";
import { MessageProvider } from "~/utils/services/message";

export type ChatBoxProps = {
    user: User
}
export const ChatBox = ({user}: ChatBoxProps) => {
    return (
        <MessageProvider>
            {(messages) => 
                <div className="bg-primary-light max-h-[500px] overflow-auto">
                    <div className="p-8 mb-15">
                        {messages?.map((message) => (
                            <ChatMessage key={message.id} message={message} isUser={message.userId === user.id}/>
                        ))}
                    </div>
                    <SendMessage user={user}/>
                </div>
            }
        </MessageProvider>
    );
};
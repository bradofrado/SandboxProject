import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { Message } from "./message";
import SendMessage from "./send-message";
import { useAuth } from "~/utils/services/auth";
import { User } from "~/utils/types/auth";

export type ChatBoxProps = {
    user: User
}
export const ChatBox = ({user}: ChatBoxProps) => {
    const query = useChatMessages();
    const scroll = useRef();


    if (query.isLoading || query.isError) {
        return <></>
    }
    const messages = query.data;


    return (
        <div className="bg-primary-light">
            <div className="p-8 mb-15">
                {messages?.map((message) => (
                    <ChatMessage key={message.id} message={message} isUser={message.userId === user.id}/>
                ))}
            </div>
            {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
            <span ref={scroll}></span>
            <SendMessage scroll={scroll} />
        </div>
    );
};

const useChatMessages = () => {
    return {
        isLoading: false,
        isError: false,
        data: messages
    }
}

const messages: Message[] = [
    {
        id: '0',
        userId: '0',
        name: 'Bob',
        text: 'Hello there john',
        avatar: '/braydon.jpeg'
    },
    {
        id: '1',
        userId: '1',
        name: 'John',
        text: 'Hello there bob',
        avatar: '/braydon.jpeg'
    }
]
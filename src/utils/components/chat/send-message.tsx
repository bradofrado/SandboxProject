import React, { useState } from "react";
import Input from "../base/input";
import Button from "../base/button";
import { useMessages } from "~/utils/services/message";
import { User } from "~/utils/types/auth";

export type SendMessageProps = {
    user: User
}
export const SendMessage = ({ user }: SendMessageProps) => {
    const [_, send] = useMessages();
    const [message, setMessage] = useState("");

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        send(message, user);
        setMessage("");
    };
    return (
        <form onSubmit={sendMessage} className="flex w-full py-5 px-8 bg-primary">
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <Input className="w-full mr-1" value={message} onChange={(value) => setMessage(value)}/>
            <Button mode='secondary'>Send</Button>
        </form>
    );
};
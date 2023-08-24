import React, { useState } from "react";
import Input from "../base/input";
import Button from "../base/button";
import { useMessages } from "~/utils/services/message";
import { User } from "~/utils/types/auth";
import { RightArrowIcon } from "../icons/icons";

export type SendMessageProps = {
    user: User
}
export const SendMessage = ({ user }: SendMessageProps) => {
    const [_, send] = useMessages();
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        message && send(message, user);
        setMessage("");
    };
    return (
        <div  className="flex w-full pb-5 px-8 dark:bg-[#2e3033]">
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <div className="flex-1 dark:bg-[#323437] border-2 border-[#00000029] rounded-xl dark:text-white">
                <div className="py-2 px-4">
                    <input className="bg-transparent outline-none text-sm w-full " placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)}/>
                </div>
            </div>
            <button className="ml-1" onClick={sendMessage}>
                <RightArrowIcon className={`w-5 h-5 ${message ? 'fill-primary' : 'dark:fill-[#4c525c] fill-[#b4b7bb]'}`}/>
            </button>
        </div>
    );
};
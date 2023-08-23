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
        send(message, user);
        setMessage("");
    };
    return (
        <div  className="flex w-full py-5 px-8 bg-[#2e3033]">
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <div className="flex-1 bg-[#323437] border-2 border-[#00000029] rounded-xl text-white">
                <div className="py-2 px-4">
                    <input className="bg-transparent outline-none text-sm w-full" value={message} onChange={(e) => setMessage(e.target.value)}/>
                </div>
            </div>
            <button className="ml-1" onClick={sendMessage}>
                <RightArrowIcon className={`w-5 h-5 ${message ? 'fill-[#005fff]' : 'fill-[#4c525c]'}`}/>
            </button>
        </div>
    );
};
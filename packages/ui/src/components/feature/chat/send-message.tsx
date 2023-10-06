import React, { useState } from "react";
import type { User } from "model/src/user";
import { RightArrowIcon } from "../../core/icons";

export interface SendMessageProps {
  user: User;
	onSendMessage: (id: string, message: string, user: User) => void
}
export const SendMessage: React.FunctionComponent<SendMessageProps> = ({ user, onSendMessage }) => {
  const [message, setMessage] = useState("");

  const sendMessage: React.FormEventHandler = (e): void => {
		e.preventDefault();
    message && onSendMessage(user.patientId, message, user);
    setMessage("");
  };
  return (
    <form className="flex w-full pb-5 px-8 dark:bg-[#2e3033]" onSubmit={sendMessage}>
      <label hidden htmlFor="messageInput">
        Enter Message
      </label>
      <div className="flex-1 bg-gray-50 dark:bg-[#323437] border-2 border-[#00000029] rounded-md dark:text-white focus-within:ring-primary focus-within:ring-2 transition-[box-shadow]">
        <div className="py-2 px-4">
          <input
            className="bg-transparent outline-none text-sm w-full "
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type your message"
            tabIndex={0}
						value={message}
          />
        </div>
      </div>
      <button className="ml-1" type="submit">
        <RightArrowIcon
          className={`w-5 h-5 ${
            message ? "fill-primary" : "dark:fill-[#4c525c] fill-[#b4b7bb]"
          }`}
        />
      </button>
    </form>
  );
};

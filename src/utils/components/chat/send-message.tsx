import React, { useState } from "react";
import Input from "../base/input";
import Button from "../base/button";

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <form onSubmit={(event) => void sendMessage(event)} className="flex w-full py-5 px-8 bg-primary">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <Input className="w-full mr-1" value={message} onChange={(value) => setMessage(value)}/>
      <Button mode='secondary'>Send</Button>
    </form>
  );
};

export default SendMessage;
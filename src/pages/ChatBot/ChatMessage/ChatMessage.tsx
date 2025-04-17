// components/ChatMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import UserMessage from "./UserMessage.tsx";
import BotMessage from "./BotMessage.tsx";

interface ChatMessageProps {
  message: Message;
}
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
      <div className={`flex justify-center w-full`}>
        <div className={`flex flex-col justify-center w-2/3`}>
          {message.isUser ? <UserMessage message={message} /> : <BotMessage message={message} />}
        </div>
      </div>
  )
};

export default ChatMessage;
// components/ChatMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import UserMessage from "./UserMessage.tsx";
import BotMessage from "./BotMessage.tsx";

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}
const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  return (
      <div className={`flex justify-center w-full`}>
        <div className={`flex flex-col justify-center w-2/3`}>
          {
            props.isLoading ? (
              <div className={`flex items-center justify-center w-full`}>
                <div className={`animate-pulse bg-gray-200 rounded-full h-4 w-1/2`}></div>
              </div>
            ) : props?.message?  props.message.sender==="USER"  ? <UserMessage message={props.message} /> : <BotMessage message={props.message} />:null
          }
        </div>
      </div>
  )
};

export default ChatMessage;
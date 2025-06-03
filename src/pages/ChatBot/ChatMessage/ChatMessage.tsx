import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { UserMessage } from "./UserMessage.tsx";
import { BotMessage } from "./BotMessage.tsx";

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  if (props.isLoading) {
    return (
      <div className="flex justify-start items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">AI</span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-md p-4 shadow-lg border border-white/30">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!props.message) return null;

  return props.message.sender === "USER" ?
    <UserMessage message={props.message} /> :
    <BotMessage message={props.message} />;
};

export default ChatMessage;

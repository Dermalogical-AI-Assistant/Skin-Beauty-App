//ChatBot/ChatMessage/BotMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { RxCopy } from "react-icons/rx";
import { TbRefresh } from "react-icons/tb";
import ReactMarkdown from 'react-markdown';

interface BotMessageProps {
  message: Message;
}

const BotMessage: React.FC<BotMessageProps> = ({ message }) => {
  const handleCopyFromDiv = () => {
    navigator.clipboard.writeText(message.message)
      .then(() => {
        console.log('Copied successfully!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="flex justify-start items-start space-x-3 mb-4">
      {/* Bot Avatar */}
      <div className="w-10 h-10 bg-gradient-to-br from-pink-light/50 to-pink-light rounded-xl flex-shrink-0 flex items-center justify-center">
        <span className="text-white text-sm font-semibold">TD</span>
      </div>

      {/* Bot Message Content */}
      <div className="flex flex-col max-w-[70%]">
        {/* Bot Name */}
        <div className="flex items-center gap-2 mb-2 text-pink-light">
          <span>TD Cosmetic</span>
          <IoArrowUpCircleOutline size={17} className="rotate-[135deg]"/>
        </div>

        {/* Message Bubble */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-md p-4 shadow-lg border border-white/30">
          <div className="prose prose-sm text-primary-dark" id="bot-message">
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>

        {/* Actions and Time */}
        <div className="flex items-center gap-3 text-xs text-primary-dark/25 py-2 px-2">
          <div className="flex items-center gap-3">
            <button className="hover:text-primary-dark/50"
                    onClick={handleCopyFromDiv}>
              <RxCopy size={19}/>
            </button>
          </div>
          <span className="text-primary-dark/25">|</span>
          {message?.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''}
        </div>
      </div>
    </div>
  );
};

export { BotMessage };
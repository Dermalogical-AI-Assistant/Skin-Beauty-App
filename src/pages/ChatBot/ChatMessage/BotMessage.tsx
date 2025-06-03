import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { RxCopy } from "react-icons/rx";
import { TbRefresh } from "react-icons/tb";

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
    <div className="flex justify-start items-start space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg">
        <span className="text-white text-sm font-semibold">AI</span>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-white/70">
          <span className="text-sm font-medium">TD Cosmetic</span>
          <IoArrowUpCircleOutline size={16} className="rotate-[135deg]"/>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-md p-4 shadow-lg border border-white/30">
          <div
            className="prose prose-sm text-gray-800 max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: message.message }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <button
              className="hover:text-white/70 transition-colors p-1 rounded"
              onClick={handleCopyFromDiv}
              title="Copy message"
            >
              <RxCopy size={14}/>
            </button>
            <button
              className="hover:text-white/70 transition-colors p-1 rounded"
              title="Regenerate response"
            >
              <TbRefresh size={16}/>
            </button>
          </div>
          <span className="text-white/30">|</span>
          <span>
            {message?.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export { BotMessage };
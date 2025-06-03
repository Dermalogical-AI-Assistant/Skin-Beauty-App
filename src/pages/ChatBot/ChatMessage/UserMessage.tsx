import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { FiEdit } from "react-icons/fi";
import { RxCopy } from "react-icons/rx";

interface UserMessageProps {
  message: Message;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
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
    <div className="flex justify-end items-start space-x-3">
      <div className="flex-1 flex flex-col items-end">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl rounded-tr-md p-4 shadow-lg max-w-xs lg:max-w-md xl:max-w-lg">
          <p className="text-sm leading-relaxed">{message.message}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
          <button
            className="hover:text-white/70 transition-colors p-1 rounded"
            onClick={handleCopyFromDiv}
            title="Copy message"
          >
            <RxCopy size={14}/>
          </button>
          <button
            className="hover:text-white/70 transition-colors p-1 rounded"
            title="Edit message"
          >
            <FiEdit size={14}/>
          </button>
          <span className="text-white/30">|</span>
          <span>
            {message?.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
        <img
          src="https://miguelminambres.com/wp-content/uploads/2021/10/Social-04-810x1024.jpg"
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export { UserMessage };
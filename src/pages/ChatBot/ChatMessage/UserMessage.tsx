//ChatBot/ChatMessage/UserMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { RxCopy } from "react-icons/rx";
import useAuth from "../../../hooks/useAuth.ts";
import useAuthStore from "../../../stores/AuthStore.ts";

interface UserMessageProps {
  message: Message;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const {user} = useAuthStore();
  const handleCopyFromDiv = () => {
    const element = document.getElementById('copy');
    if (element) {
      const text = element.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Copied successfully!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  };

  return (
    <div className="flex justify-end items-start space-x-3 mb-4">
      {/* User Message Content */}
      <div className="flex flex-col max-w-[70%]">
        {/* Message Bubble */}
        <div className="bg-gradient-to-r from-pink-light/10 to-pink-light/30 rounded-2xl rounded-tr-md p-4 shadow-lg">
          <div className="flex items-start gap-2">
            <p className="text-primary-dark/70 text-md font-medium flex-1" id="copy">{message.message}</p>
            {/*<button className="text-white/70 hover:text-white flex-shrink-0">*/}
            {/*  <FiEdit size={19}/>*/}
            {/*</button>*/}
          </div>
        </div>

        {/* Actions and Time */}
        <div className="flex items-center justify-end gap-3 text-xs mt-1 text-primary-dark/25 px-2">
          <div className="flex items-center gap-3">
            <button className="hover:text-primary-dark/50"
                    onClick={handleCopyFromDiv}>
              <RxCopy size={17}/>
            </button>
          </div>
          <span className="text-primary-dark/25">|</span>
          {message?.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''}
        </div>
      </div>

      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={ user?.avatar }
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export { UserMessage };
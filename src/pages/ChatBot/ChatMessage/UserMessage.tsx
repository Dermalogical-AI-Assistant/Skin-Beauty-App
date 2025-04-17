// components/ChatMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { FiEdit } from "react-icons/fi";
import { RxCopy } from "react-icons/rx";

interface UserMessageProps {
  message: Message;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {

  const handleCopyFromDiv = () => {
    const element = document.getElementById('copy');
    if (element) {
      const text = element.innerText; // giữ lại format hiển thị, bỏ tag HTML
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
    <div className={`flex relative w-full my-2`}>
      <div className={`absolute -left-12 top-0 w-10 h-10 rounded-full  overflow-hidden`}>
        <img
          src="https://miguelminambres.com/wp-content/uploads/2021/10/Social-04-810x1024.jpg"
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`flex flex-col rounded-lg w-full`}>
        <div className={`flex flex-row gap-2 items-start justify-between w-full`}>
          <p className={`w-full`} id={`copy`}>{message.message}</p>
          <button className={`text-primary-dark/50 hover:text-primary-dark/75`}>
            <FiEdit size={19}/>
          </button>
        </div>
        <div className={`flex items-center gap-3 text-xs mt-1 text-primary-dark/25`}>
          <div className={`flex items-center gap-3`}>
            <button className={` hover:text-primary-dark/50`}
              onClick={handleCopyFromDiv}
            >
              <RxCopy size={17}/>
            </button>
          </div>
          <span className={`text-primary-dark/25`}>|</span>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
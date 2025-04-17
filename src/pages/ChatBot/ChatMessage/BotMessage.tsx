// components/ChatMessage.tsx
import React from 'react';
import { Message } from '../../../types/ChatBot.ts';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { RxCopy } from "react-icons/rx";
import { TbRefresh } from "react-icons/tb";

interface UserMessageProps {
  message: Message;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {

  const handleCopyFromDiv = () => {
    const element = document.getElementById('bot-message');
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
    <div className={`flex justify-start items-start`}>
      <div className={`flex flex-col mb-10`}>

        <div className={`flex items-center gap-2 mb-2 text-pink-light`}>
          <span>TD Cosmetic</span>
          <IoArrowUpCircleOutline size={17} className={`rotate-[135deg]`}/>
        </div>

        <div className={``}>
          <div className={`prose prose-sm rounded-lg  text-primary-dark `}
               id={`bot-message`}
               dangerouslySetInnerHTML={{ __html: message.content }}
          >
          </div>
          <div className={`flex items-center gap-3 text-xs text-primary-dark/25 py-2`}>
            <div className={`flex items-center gap-3`}>
              <button className={` hover:text-primary-dark/50`}
                onClick={handleCopyFromDiv}
              >
                <RxCopy size={19}/>
              </button>
              <button className={` hover:text-primary-dark/50`}>
                <TbRefresh size={21}/>
              </button>
            </div>
            <span className={`text-primary-dark/25`}>|</span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
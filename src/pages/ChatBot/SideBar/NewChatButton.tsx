// components/NewChatButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";

interface NewChatButtonProps {
  onClick: () => void;
  loading?: boolean;
  isIconOnly?: boolean;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick, loading = false, isIconOnly=false }) => {

  return (
    <button
      className={`${isIconOnly ? 'w-11' : 'w-full'} h-11 bg-pink-light hover:bg-pink-light rounded-full text-white py-2 px-4 flex items-center justify-center transition duration-200 ease-in-out`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <div className="flex items-center gap-2 text-md">
          <FiPlus size={19}/>
          <div className={`${isIconOnly ? 'hidden' : ''} text-sm`}>
            New Chat
          </div>
        </div>
      )}
    </button>
  );
};

export default NewChatButton;
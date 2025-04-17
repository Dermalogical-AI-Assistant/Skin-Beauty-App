// components/Sidebar.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import NewChatButton from './NewChatButton.tsx';
import HistoryList from './HistoryList.tsx';
import  { createNewChat } from '../../../hooks/useChatBot.ts';
import { ChatHistory } from '../../../types/ChatBot.ts';
import useChatBotSessions from "../../../hooks/useChatBotSessions.ts";
import DeleteModal from "./DeleteModal.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTE_CHATBOT } from "../../../constants/routes.ts";

const Sidebar: React.FC = () => {
  const [creatingChat, setCreatingChat] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatHistory[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    onCreateNewChatbotSession,
    onDeleteAllChatbotSessions,
    fetchChatHistory: {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isSuccess
    }
  } = useChatBotSessions();

  // Load the first page of history when component mounts
  useEffect(() => {
    if (data && isSuccess) {
      const merged = data.pages.flatMap(page => page.data);
      setChatSessions(merged);
    }
  }, [data, isSuccess]);

  const handleNewChat = () => {
    setCreatingChat(true);
    onCreateNewChatbotSession(
      (newSession) => {
        // Add the new session to the beginning of chatSessions
        setChatSessions(prevSessions => [newSession, ...prevSessions]);
        setCreatingChat(false);
        // Navigate to the new chat session
        navigate(`${ROUTE_CHATBOT}/${newSession.id}`);
      },
      () => {
        // Handle error if needed
        console.error('Failed to create new chat');
        setCreatingChat(false);
      }
    );
  }

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetching || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomHeightLoading = 100; //px
    if (scrollHeight - scrollTop - clientHeight < bottomHeightLoading) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetching, hasNextPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleDeleteAll = () => {
    onDeleteAllChatbotSessions(
      () => {
        setChatSessions([]);
        setIsDeleteModalOpen(false);
      },
      () => {
        setIsDeleteModalOpen(false);
      }
    );
  }


  return (
    <div className="w-96 h-full bg-secondary flex flex-col overflow-hidden">
      {/*DELETE ALL CHAT MODAL*/}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete all chats?"
        subtitle="Are you sure you want to delete all chats?"
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteAll}
      />

      {/*Chat button*/}
      <div className={`flex items-center mt-4 mb-2 py-2 px-4 gap-2`}>
        <div className={`flex w-full`}>
          <NewChatButton onClick={handleNewChat} loading={creatingChat} />
        </div>
        <div className={``}>
        </div>
      </div>

      {/*Clear all chat*/}
      <div className={`flex items-center justify-between mt-4 mb-2 border-y border-secondary-dark/10 py-2 px-4`}>
        <span className={`text-secondary-dark font-baloo`}>Your conversations</span>
        <button
          className={`text-pink-light hover:text-orange-700 font-baloo font-medium  disabled:text-pink-light/75 disabled:cursor-not-allowed`}
          onClick={() => {
            setIsDeleteModalOpen(true);
          }}
          disabled={chatSessions.length === 0}
        >Clear all</button>
      </div>

      {/*Histories*/}
      <div className=" flex-grow overflow-y-auto overflow-x-hidden
        {/* custom scroll bar */}
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
           ref={scrollContainerRef}
      >
        <div className={`px-2 text-sm`}>
          <HistoryList
            chatHistory={chatSessions}
            loading={isFetching}
            onDeleteSessionSuccess={(sessionId) => {
              setChatSessions(prev => prev.filter(chatSession => chatSession.id !== sessionId));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

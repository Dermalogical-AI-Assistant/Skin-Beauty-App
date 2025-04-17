
  // components/ChatArea.tsx
  import React, { useState, useEffect, useRef } from 'react';
  import { useParams } from 'react-router-dom';
  import ChatMessage from './ChatMessage/ChatMessage.tsx';
  import LoadingIndicator from './LoadingIndicator';
  import { fetchChatMessages, sendMessage } from '../../hooks/useChatBot.ts';
  import { Message } from '../../types/ChatBot';
  import { AiOutlineLoading3Quarters } from "react-icons/ai";
  import WelcomePage from "./WelcomePage.tsx";


  const ChatArea: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tải tin nhắn khi chatId thay đổi
    useEffect(() => {
      const loadMessages = async () => {
        if (!sessionId) return;

        try {
          setLoading(true);
          const fetchedMessages = await fetchChatMessages(sessionId);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Failed to load messages:', error);
        } finally {
          setLoading(false);
        }
      };

      loadMessages();
    }, [sessionId]);

    // Cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
      if (!inputValue.trim() || !sessionId || sendingMessage) return;

      // Thêm tin nhắn người dùng vào danh sách
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: inputValue,
        isUser: true,
        timestamp: new Date()
      };

      setMessages([...messages, userMessage]);
      setInputValue('');
      setSendingMessage(true);

      try {
        // Gọi API để gửi tin nhắn và nhận phản hồi
        const botResponse = await sendMessage(sessionId, userMessage.content);
        setMessages(prevMessages => [...prevMessages, botResponse]);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setSendingMessage(false);
      }
    };

    // Hiển thị tin nhắn chào mừng nếu không có chatId
    if (!sessionId) {
      return (
        <WelcomePage/>
      );
    }

    return (
      <div className="relative flex flex-col w-full h-full">
        <div className="absolute z-10 flex justify-center bottom-0 mb-16  w-full">
          <div className="flex gap-3 items-center w-2/4 bg-white/85 shadow-xl backdrop-blur-sm rounded-full py-2 px-3">
            <div className={` p-2 text-2xl text-shadow-2xl drop-shadow-[0_10px_15px_rgba(221,15,5,0.3)]`}>
              🧠
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow focus:outline-none"
              placeholder="What’s in your mind?...  "
              disabled={loading || sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || sendingMessage || !inputValue.trim()}
              className={`p-2 w-13 h-13 rounded-full flex items-center justify-center ${
                loading || sendingMessage || !inputValue.trim()
                  ? 'bg-pink-light/50'
                  : 'bg-pink-light/85  hover:bg-pink-light text-white'
              }`}
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full text-white "><AiOutlineLoading3Quarters size={24}/></div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23016 7.39969 6.32015Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.1099 13.6498L13.6899 10.0598" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex-grow p-4 overflow-x-scroll w-full
        {/* custom scroll bar */}
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-primary-dark/75
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
        ">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <div className={`pb-20`}>
              {messages.map((message,index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ChatArea;
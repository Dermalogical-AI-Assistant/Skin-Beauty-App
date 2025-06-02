// components/ChatArea.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from 'react-router-dom';
import ChatMessage from './ChatMessage.tsx';
import LoadingIndicator from '../LoadingIndicator.tsx';
import { Message } from "../../../types/ChatBot.ts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import WelcomePage from "../WelcomePage.tsx";
import useChatBotMessages from "../../../hooks/useChatBotMessages.ts";

interface ChatAreaProps {
  sessionId?: string;
}

const ChatArea: React.FC<ChatAreaProps> = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef<number>(0);
  const initialDataLoaded = useRef<boolean>(false);
  const previousPagesCount = useRef<number>(0);
  const [, setIsSendingMessage] = useState(true);

  const {
    onSentMessage,
    fetchMessages: {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isSuccess
    }
  } = useChatBotMessages(10, sessionId || '');


  useEffect(() => {
    // Reset messages when sessionId changes
    setMessages([]);
    setInitialScrollDone(false);
    initialDataLoaded.current = false;
    previousPagesCount.current = 0;
  }, [sessionId]);

  useEffect(() => {
    if (data && data.pages) {
      const newMessages = data.pages[data.pages.length - 1].data || [];

      if (!initialDataLoaded.current && newMessages.length > 0) {
        // Lần đầu tiên tải dữ liệu
        initialDataLoaded.current = true;
        const allMessages = data.pages.flatMap(page => page.data || []);
        setMessages(allMessages);
      } else if (data.pages.length > previousPagesCount.current) {
        // Load thêm dữ liệu cũ -> thêm vào đầu danh sách
        setMessages(prev => [...newMessages, ...prev]);
      }

      previousPagesCount.current = data.pages.length;
    }
  }, [data]);

  // Auto scroll to bottom ONLY on initial data load
  useEffect(() => {
    // Chỉ thực hiện auto-scroll một lần khi dữ liệu đầu tiên được tải
    if (isSuccess && !initialScrollDone && messages.length > 0 && !isFetching && initialDataLoaded.current) {
      console.log("Thực hiện scroll xuống dưới cùng một lần duy nhất");
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setInitialScrollDone(true);
      // Tắt auto-scroll cho các lần cập nhật sau (trừ khi gửi tin nhắn mới)
      setAutoScrollEnabled(false);
    }
  }, [isSuccess, initialScrollDone, messages, isFetching]);

  // Chỉ auto-scroll khi gửi tin nhắn mới
  useEffect(() => {
    if (sendingMessage === false && messagesEndRef.current && autoScrollEnabled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sendingMessage, autoScrollEnabled, messages]);

  // Xử lý sự kiện scroll để phát hiện khi người dùng scroll lên đầu trang
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;

      // Kiểm tra xem đang scroll lên không
      const isScrollingUp = scrollTop < lastScrollTop.current;

      // Cập nhật vị trí scroll cuối cùng
      lastScrollTop.current = scrollTop;

      // Tải thêm tin nhắn khi scroll lên đầu trang
      // Chỉ khi:
      // 1. Gần đầu trang (scrollTop < 50)
      // 2. Đang scroll lên
      // 3. Còn trang để tải
      // 4. Không đang tải dữ liệu
      // 5. Đã hoàn thành scroll ban đầu
      if (scrollTop < 50 && isScrollingUp && hasNextPage && !isFetching && initialScrollDone) {
        console.log("Tải trang tiếp theo khi scroll lên đầu");
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetching, initialScrollDone]);

  // Thêm sự kiện lắng nghe scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || sendingMessage) return;

    // Tạm thời bật auto-scroll cho tin nhắn mới này
    setAutoScrollEnabled(true);

    // Thêm tin nhắn người dùng vào danh sách
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      message: inputValue,
      sender: "USER",
      createdAt: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setSendingMessage(true);
    setIsSendingMessage(true);

    try {
      // Gửi tin nhắn đến API
      await onSentMessage(
        {
          sessionId,
          sender: userMessage.sender,
          message: userMessage.message
        },
        (botMessage) => {
          setMessages(prevMessages => [...prevMessages, botMessage]);
        },
        (error) => {
          console.error('Không thể gửi tin nhắn:', error);
          // Hiển thị lỗi hoặc phản hồi thất bại nếu cần
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            message: "❌ Gửi tin nhắn thất bại. Vui lòng thử lại.",
            sender: "ADMIN",
            createdAt: new Date()
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      );
    } finally {
      setSendingMessage(false);
      setTimeout(() => setAutoScrollEnabled(false), 100);
    }
  };

  // Hiển thị trang chào mừng nếu không có sessionId
  if (!sessionId) {
    return <WelcomePage />;
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="absolute z-10 flex justify-center bottom-0 mb-16 w-full">
        <div className="flex gap-3 items-center w-2/4 bg-white/85 shadow-xl backdrop-blur-sm rounded-full py-2 px-3">
          <div className="p-2 text-2xl text-shadow-2xl drop-shadow-[0_10px_15px_rgba(221,15,5,0.3)]">
            🧠
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow focus:outline-none"
            placeholder="What's in your mind?..."
            disabled={isFetching || sendingMessage}
          />
          <button
            onClick={handleSendMessage}
            disabled={isFetching || sendingMessage || !inputValue.trim()}
            className={`p-2 w-13 h-13 rounded-full flex items-center justify-center ${
              isFetching || sendingMessage || !inputValue.trim()
                ? 'bg-pink-light/50'
                : 'bg-pink-light/85 hover:bg-pink-light text-white'
            }`}
          >
            {sendingMessage ? (
              <div className="animate-spin rounded-full text-white"><AiOutlineLoading3Quarters size={24}/></div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23016 7.39969 6.32015Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.1099 13.6498L13.6899 10.0598" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div
        className="flex-grow p-4 overflow-y-auto overflow-x-hidden w-full
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-primary-dark/75
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
          "
        ref={scrollContainerRef}
      >
        {isFetching && !messages.length ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="pb-56">
              {isFetching && messages.length > 0 && initialScrollDone && (
                <div className="flex justify-center py-2">
                  Loading...
                  <AiOutlineLoading3Quarters className="animate-spin text-primary" size={24} />
                </div>
              )}

              {messages.map((message, index) => (
                <ChatMessage key={`${index}`} message={message} />
              ))}
              {sendingMessage && (
                <ChatMessage  isLoading={true}  />
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
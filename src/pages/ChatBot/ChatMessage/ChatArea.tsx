// ChatBot/ChatMessage/ChatArea.tsx
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
  const [aiTyping, setAiTyping] = useState(false); // Thêm state cho AI typing
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef<number>(0);
  const initialDataLoaded = useRef<boolean>(false);
  const previousPagesCount = useRef<number>(0);

  const {
    isSendingMessage,
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
        initialDataLoaded.current = true;
        const allMessages = data.pages.flatMap(page => page.data || []).reverse();
        setMessages(allMessages);
      } else if (data.pages.length > previousPagesCount.current) {
        const scrollContainer = scrollContainerRef.current;
        const currentScrollHeight = scrollContainer?.scrollHeight || 0;
        const newMessagesReversed = newMessages.reverse();
        setMessages(prev => [...newMessagesReversed, ...prev]);

        setTimeout(() => {
          if (scrollContainer) {
            const newScrollHeight = scrollContainer.scrollHeight;
            const scrollDifference = newScrollHeight - currentScrollHeight;
            scrollContainer.scrollTop = scrollContainer.scrollTop + scrollDifference;
          }
        }, 0);
      }

      previousPagesCount.current = data.pages.length;
    }
  }, [data]);

  // Auto scroll to bottom ONLY on initial data load
  useEffect(() => {
    if (isSuccess && !initialScrollDone && messages.length > 0 && !isFetching && initialDataLoaded.current) {
      console.log("Thực hiện scroll xuống dưới cùng một lần duy nhất");
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setInitialScrollDone(true);
      setAutoScrollEnabled(false);
    }
  }, [isSuccess, initialScrollDone, messages, isFetching]);

  // Chỉ auto-scroll khi gửi tin nhắn mới hoặc AI đang typing
  useEffect(() => {
    if (((sendingMessage === false && autoScrollEnabled) || aiTyping) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sendingMessage, autoScrollEnabled, messages, aiTyping]);

  // Xử lý sự kiện scroll để phát hiện khi người dùng scroll lên đầu trang
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      const isScrollingUp = scrollTop < lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      // Tải thêm tin nhắn khi scroll lên đầu trang
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

    setSendingMessage(true);

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

    try {
      await onSentMessage(
        {
          sessionId,
          sender: userMessage.sender,
          message: userMessage.message
        },
        (botMessage) => {
          setSendingMessage(false);
          setMessages(prevMessages => [...prevMessages, botMessage]);
        },
        (error) => {
          setAiTyping(false);
          setSendingMessage(false);
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            message: "Sorry, I couldn't process your request. Please try again later.",
            sender: "BOT",
            createdAt: new Date()
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      );
    } finally {
      setSendingMessage(false);
      setAiTyping(false);
      setTimeout(() => setAutoScrollEnabled(false), 100);
    }
  };

  // Hiển thị trang chào mừng nếu không có sessionId
  if (!sessionId) {
    return <WelcomePage />;
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      {
        // Hiển thị thông báo nếu không có tin nhắn nào
        messages.length === 0 && !isFetching && (
          <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center text-primary-dark/50 ">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <p className="text-center text-xl  font-bold">No messages yet. Start the conversation!</p>
              </div>
            </div>
          </div>
        )
      }
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
            disabled={isFetching || isSendingMessage}
          />
          <button
            onClick={handleSendMessage}
            disabled={isFetching || sendingMessage || aiTyping || !inputValue.trim()}
            className={`p-2 w-13 h-13 rounded-full flex items-center justify-center ${
              isFetching || sendingMessage || aiTyping || !inputValue.trim()
                ? 'bg-pink-light/50'
                : 'bg-pink-light/85 hover:bg-pink-light text-white'
            }`}
          >
            {sendingMessage || aiTyping ? (
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
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        ref={scrollContainerRef}
      >
        {isFetching && !messages.length ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="pb-56 w-2/3 mx-auto">
              {/* Loading indicator cho việc load thêm tin nhắn cũ */}
              {isFetching && messages.length > 0 && initialScrollDone && (
                <div className="flex justify-center py-4 mb-4">
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <AiOutlineLoading3Quarters className="animate-spin" size={16} />
                    <span>Loading more messages...</span>
                  </div>
                </div>
              )}


              {/* Danh sách tin nhắn theo thứ tự bình thường */}
              {messages.map((message, index) => (
                <ChatMessage key={message.id || index} message={message} />
              ))}

              {/* Hiển thị AI typing khi đang chờ phản hồi */}
              {isSendingMessage && (
                <ChatMessage isLoading={true} />
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
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { Message } from "../../types/ChatBot.ts";
import useChatBotMessages from "../../hooks/useChatBotMessages.ts";
import WelcomePage from "./WelcomePage.tsx";
import LoadingIndicator from "./LoadingIndicator.tsx";
import ChatMessage from "./ChatMessage/ChatMessage.tsx";

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
        const allMessages = data.pages.flatMap(page => page.data || []);
        setMessages(allMessages);
      } else if (data.pages.length > previousPagesCount.current) {
        setMessages(prev => [...newMessages, ...prev]);
      }

      previousPagesCount.current = data.pages.length;
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess && !initialScrollDone && messages.length > 0 && !isFetching && initialDataLoaded.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setInitialScrollDone(true);
      setAutoScrollEnabled(false);
    }
  }, [isSuccess, initialScrollDone, messages, isFetching]);

  useEffect(() => {
    if (sendingMessage === false && messagesEndRef.current && autoScrollEnabled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sendingMessage, autoScrollEnabled, messages]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      const isScrollingUp = scrollTop < lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      if (scrollTop < 50 && isScrollingUp && hasNextPage && !isFetching && initialScrollDone) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetching, initialScrollDone]);

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

    setAutoScrollEnabled(true);

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

  if (!sessionId) {
    return <WelcomePage />;
  }

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 m-4 overflow-hidden">
      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-6 pb-2 scroll-smooth
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-white/10
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-white/30
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:hover:bg-white/50
          scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10"
        ref={scrollContainerRef}
      >
        {isFetching && !messages.length ? (
          <LoadingIndicator />
        ) : (
          <div className="space-y-4">
            {isFetching && messages.length > 0 && initialScrollDone && (
              <div className="flex justify-center items-center py-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <AiOutlineLoading3Quarters className="animate-spin" size={16} />
                  <span>Loading more messages...</span>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <ChatMessage key={`${index}`} message={message} />
            ))}

            {sendingMessage && (
              <ChatMessage isLoading={true} />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 p-6 pt-4">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 px-6 py-4 hover:shadow-xl transition-all duration-300">
          <div className="flex-shrink-0 text-2xl">
            🧠
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500 text-base"
            placeholder="What's in your mind?..."
            disabled={isFetching || sendingMessage}
          />
          <button
            onClick={handleSendMessage}
            disabled={isFetching || sendingMessage || !inputValue.trim()}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isFetching || sendingMessage || !inputValue.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {sendingMessage ? (
              <AiOutlineLoading3Quarters className="animate-spin" size={20}/>
            ) : (
              <IoSend size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ChatArea };
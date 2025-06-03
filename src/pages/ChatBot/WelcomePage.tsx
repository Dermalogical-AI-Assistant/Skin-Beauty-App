import React from 'react';

const WelcomePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 m-4 overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-white/80 max-w-md">
          <div className="relative mb-6">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Chào mừng đến với MyBot
          </h2>
          <p className="text-white/60 leading-relaxed">
            Bắt đầu một cuộc trò chuyện mới hoặc chọn từ lịch sử bên trái để tiếp tục
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
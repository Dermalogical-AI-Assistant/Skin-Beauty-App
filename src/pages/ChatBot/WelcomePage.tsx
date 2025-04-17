// components/WelcomePage.tsx
import React from 'react';

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <h2 className="text-xl font-medium mb-1">Chào mừng đến với MyBotghih</h2>
          <p>Bắt đầu một cuộc trò chuyện mới hoặc chọn từ lịch sử bên trái</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
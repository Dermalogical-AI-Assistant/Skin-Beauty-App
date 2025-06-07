import React, { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../Admin/Navbar.tsx";

interface LayoutProps {
  children?: ReactNode;
}

const ChatLayout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="relative flex h-screen font-baloo text-primary-dark bg-primary">
      {/* Main Content */}
      <div className={"relative h-full flex flex-1"}>
        <div className="h-full flex flex-col flex-1 bg-white/60 rounded-2xl shadow-lg ">
          <main className="relative h-full">
            <div className="h-full">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
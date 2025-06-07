//ChatBot/index.tsx
import Sidebar from "./SideBar/Sidebar.tsx";
import { Outlet } from "react-router-dom";
import Navbar from "../../layouts/Admin/Navbar.tsx";
import React from "react";

const ChatBot: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-primary overflow-hidden">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-shrink-0 z-30">
            <Navbar/>
          </div>
          <div className="flex-1 overflow-hidden">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
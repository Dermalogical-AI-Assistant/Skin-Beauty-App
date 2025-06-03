import React, { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from "./Navbar.tsx";
import AcountMenu from "./AccountMenu.tsx";
import { E_PageRoleType } from "../../types/SystemType.ts";

interface LayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    localStorage.setItem("pageRole", E_PageRoleType.ADMIN);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
      <div className="relative flex h-screen font-baloo text-primary-dark bg-primary">
        {/* Sidebar */}
        <div className={"p-5"}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* Main Content */}
        <div className={"relative h-full p-5 flex flex-1 overflow-hidden"}>
          <div className="h-full flex flex-col flex-1 bg-white/60 rounded-2xl shadow-lg ">
            <div className={`relative z-30`}>
              <Navbar/>
            </div>
            <main className="relative h-full overflow-hidden">
              <div className="h-full">
                {/*<div className="sticky top-0 h-6 !bg-gradient-to-b !from-white border !to-white/0 z-10 pointer-events-none"></div>*/}
                {children || <Outlet />}
                <div className="sticky  z-10  bottom-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-bl-2xl rounded-br-2xl"></div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
};

export default AdminLayout;
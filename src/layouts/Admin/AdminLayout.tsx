import React, { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from "./Navbar.tsx";
import AcountMenu from "./AccountMenu.tsx";

interface LayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
      <div className="flex h-screen font-baloo text-primary-dark bg-primary">
        {/* Sidebar */}
        <div className={"p-5"}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* Main Content */}
        <div className={"h-full p-5 flex flex-1 overflow-hidden"}>
          <div className="h-full flex flex-col flex-1 bg-white rounded-2xl shadow-lg py-6">
            <Navbar/>
            <main className="h-full overflow-hidden">
              <div className="h-full">
              {children || <Outlet />}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
};

export default AdminLayout;
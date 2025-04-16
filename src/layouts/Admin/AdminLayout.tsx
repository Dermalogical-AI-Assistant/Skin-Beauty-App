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
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 bg-white m-5 rounded-2xl shadow-lg p-2">
              <Navbar/>

              <main className="flex-1 overflow-autobg-white m-4">
                  {children || <Outlet />}
              </main>
            </div>
        </div>
    );
};

export default AdminLayout;
// src/components/AdminLayout/Navbar.tsx
import React from 'react';
import { Bell, User } from 'lucide-react';
import HeaderCrums from "../../components/HeaderCrums.tsx";


const Navbar: React.FC = () => {
    return (
        <header className="h-16 flex items-center justify-between px-4">
            <HeaderCrums/>
            {/* Right side buttons */}
            <div className="flex items-center ml-4 space-x-4 px-32">
                {/* Notifications */}
                <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                    <button className="flex items-center space-x-2 text-gray-700 focus:outline-none">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} />
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
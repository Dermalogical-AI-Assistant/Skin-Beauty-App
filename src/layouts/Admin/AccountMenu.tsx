import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import useAuthStore from "../../stores/AuthStore.ts";
import { Link } from "react-router-dom";

const AcountMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLogin } = useAuthStore();

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ Zustand
    // navigate("/login"); // Chuyển hướng về trang login
    window.location.reload();
  };

  const handleToggle = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Link
        className={`font-bold ${isLogin ? 'hidden' : 'block px-5'} text-secondary-dark hover:text-primary-dark focus:outline-none`}
        to="/login"
      >Sign in</Link>
      <button
        onClick={handleToggle}
        className={`${isLogin ? 'block' : 'hidden'} text-gray-700 focus:outline-none flex items-center space-x-4 `}>
        {/* Notifications */}
        <div className="flex flex-col items-end relative">
          {/*<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>*/}
          <h1 className={`font-bold text-primary-dark`}>{user?.username}</h1>
          <p className={`text-secondary-dark`}>{user?.email}</p>
        </div>
        {/* User menu */}
        <div className="relative">
          <button className="space-x-2 text-gray-700 focus:outline-none">
            <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden">
              <img
                src="https://miguelminambres.com/wp-content/uploads/2021/10/Social-04-810x1024.jpg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg ring-1 ring-gray-200 z-50">
          <ul className="py-1">
            <li>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                <User size={16} className="mr-2" /> Profile
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                <Settings size={16} className="mr-2" /> Settings
              </a>
            </li>
            <li>
              <button
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AcountMenu;

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import useAuthStore from "../../../stores/AuthStore.ts";

interface AccountMenuProps {
  icon?: React.ReactNode;
}

const AcountMenu: React.FC<AccountMenuProps> = (props) => {
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
    <div className="relative" ref={dropdownRef}>
      {/*Not logged in*/}
      <div className={`${isLogin ? 'hidden' : 'flex gap-1'}`}>
        <Link
          className={`px-5 text-secondary-dark hover:text-primary-dark focus:outline-none`}
          to="/login"
        >Sign in</Link>
        <span>|</span>
        <Link
          className={`px-5 text-secondary-dark hover:text-primary-dark focus:outline-none`}
          to="/register"
        >Sign up</Link>
      </div>

      {/*Logged in*/}
      <button
        onClick={handleToggle}
        className={`${isLogin ? 'block' : 'hidden'} text-gray-700 focus:outline-none flex items-center space-x-4 `}>
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <button className="space-x-2 text-primary-dark focus:outline-none">
            {props?.icon||<BiUser size={24} />}
            <div className={`${user?.avatar?'hidden':''} w-10 h-10 rounded-md bg-gray-200 overflow-hidden`}>
              <img
                src={user?.avatar||''}
                alt="User"
                className={`w-full h-full object-cover`}
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

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Link } from "react-router-dom";
import { MdSwapHoriz } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import useAuthStore from "../../../stores/AuthStore.ts";
import { ADMIN } from "../../../constants/routes.ts";

interface AccountMenuProps {
  icon?: React.ReactNode;
}

const AcountMenu: React.FC<AccountMenuProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLogin } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  useEffect(()=>{console.log("user",user)},[])

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
      <div className={`${isLogin ? "hidden" : "flex gap-1"}`}>
        <Link
          className={`text-secondary-dark hover:text-primary-dark px-5 focus:outline-none`}
          to="/login"
        >
          Sign in
        </Link>
        <span>|</span>
        <Link
          className={`text-secondary-dark hover:text-primary-dark px-5 focus:outline-none`}
          to="/register"
        >
          Sign up
        </Link>
      </div>

      {/*Logged in*/}
      <button
        onClick={handleToggle}
        className={`${isLogin ? "block" : "hidden"} flex items-center space-x-4 text-gray-700 focus:outline-none`}
      >
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <span className="text-primary-dark space-x-2 focus:outline-none">
            <div className={`${user?.avatar ? "hidden" : ""}`}>
              {props?.icon || <BiUser size={24} />}
            </div>
            <div
              className={`${user?.avatar ? "" : "hidden"} h-10 w-10 overflow-hidden rounded-md bg-gray-200`}
            >
              <img
                src={user?.avatar}
                alt="User"
                className={`h-full w-full object-cover`}
              />
            </div>
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-200">
          <ul className="py-1">
            <li>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                <User size={16} className="mr-2" /> Profile
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                <Settings size={16} className="mr-2" /> Settings
              </a>
            </li>
            <li>
              <a
                href={`${ADMIN}`}
                className="flex items-center px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                <MdSwapHoriz size={16} className="mr-2" /> Go to Admin Panel
              </a>
            </li>
            <li>
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm transition hover:bg-gray-100"
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

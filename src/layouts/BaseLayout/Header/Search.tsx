import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { BiUser } from "react-icons/bi";
import useAuthStore from "../../../stores/AuthStore.ts";
import { IoCloseOutline } from "react-icons/io5";

interface SearchProps {
  icon?: React.ReactNode;
}

const Search: React.FC<SearchProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(true);

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
      <button
        onClick={handleToggle}
        className={`text-gray-700 focus:outline-none flex items-center space-x-4 `}>
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <button className="space-x-2 text-primary-dark focus:outline-none">
            {props?.icon||<BiUser size={24} />}
          </button>
          {/*<input*/}
          {/*  className={`${!isOpen?'w-0':'w-64'}  h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-dark`}*/}
          {/*  type="text"*/}
          {/*  placeholder="Search..."*/}
          {/*/>*/}
        </div>
      </button>
    </div>
  );
};

export default Search;

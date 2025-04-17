import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";

interface ContexMenuProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const ContextMenu: React.FC<ContexMenuProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div
      className="absolute right-0" ref={dropdownRef}
      onClick={()=>{setIsOpen(!isOpen)}}
    >

      {/*Button*/}
      <button
        onClick={handleToggle}
        className={`focus:outline-none flex items-center space-x-4 `}>
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <span className="space-x-2 text-primary-dark/35 hover:text-primary-dark/75 focus:outline-none">
            <div className={``}>
              {props?.icon||<BsThreeDotsVertical size={24} />}
            </div>
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg ring-1 ring-gray-200 z-50">
          <ul className="py-1">
            {props.children}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;

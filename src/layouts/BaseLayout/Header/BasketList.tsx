import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { BiUser } from "react-icons/bi";
import useAuthStore from "../../../stores/AuthStore.ts";
import { IoCloseOutline } from "react-icons/io5";

interface BasketListProps {
  icon?: React.ReactNode;
}

const BasketList: React.FC<BasketListProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLogin } = useAuthStore();
  const [baseItems, setBaseItems] = useState<any[]>([
    {
      id: 1,
      title: "Item 1",
      image: "https://via.placeholder.com/150",
      link: "/item1",
      quantity: 2,
      price: 10.0,
    },
    {
      id: 2,
      title: "Item 2",
      image: "https://via.placeholder.com/150",
      link: "/item2",
      quantity: 1,
      price: 20.0,
    },
    {
      id: 3,
      title: "Item 3",
      image: "https://via.placeholder.com/150",
      link: "/item3",
      quantity: 3,
      price: 15.0,
    },
  ]);

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
      <span className={`bg-red-700 text-white rounded-full w-4 h-4 absolute z-1 -bottom-2 right-0 flex items-center justify-center text-xs font-bold`}>3</span>
      <button
        onClick={handleToggle}
        className={`text-gray-700 focus:outline-none flex items-center space-x-4 `}>
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <span className="space-x-2 text-primary-dark focus:outline-none">
            {props?.icon||<BiUser size={24} />}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg ring-1 ring-gray-200 z-50">
          {/*recently added products*/}
          <div className={`px-4 pt-2 text-sm font-medium text-secondary-dark`}>Recently added products</div>
          <ul className="py-1">
            {baseItems.map((item) => (
              <li key={item.id} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition">
                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-md mr-2" />
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-xs text-gray-500">Price: ${item.price.toFixed(2)}</p>
                </div>
                <button className={ `ml-auto text-gray-500 hover:text-red-500`} onClick={() => {
                  setBaseItems(baseItems.filter(i => i.id !== item.id));
                }}>
                  <IoCloseOutline size={16} />
                </button>
              </li>
            ))}
            <li className="border-t border-gray-200"></li>
            <li>
              <div className={`flex items-center justify-between px-4 py-2 text-sm`}>
                <span className="text-sm font-semibold text-secondary-dark">{baseItems.length} More products</span>
                <button
                  className="flex items-center px-4 py-2 text-sm font-medium hover:text-white hover:font-bold text-secondary bg-pink-light rounded-md transition"
                >
                  Open Shopping bag
                </button>
              </div>

            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BasketList;

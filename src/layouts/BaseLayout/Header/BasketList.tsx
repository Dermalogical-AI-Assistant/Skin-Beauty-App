import React, { useState, useRef, useEffect } from 'react';
import { BiUser } from "react-icons/bi";
import useAuthStore from "../../../stores/AuthStore.ts";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ROUTE_BASKET } from "../../../constants/routes.ts";

interface BasketItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  currency?: string;
  addedAt?: string;
}

interface BasketListProps {
  icon?: React.ReactNode;
}

const BasketList: React.FC<BasketListProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLogin } = useAuthStore();
  const [cartItems, setCartItems] = useState<BasketItem[]>([]);

  // Function to get cart items from localStorage
  const getCartItems = (): BasketItem[] => {
    try {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return [];
    }
  };

  // Function to save cart items to localStorage
  const saveCartItems = (items: BasketItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart data to localStorage:', error);
    }
  };

  // Function to remove item from cart
  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Calculate total number of items in cart
  const getTotalItemCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Load cart items on component mount
  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        setCartItems(getCartItems());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for localStorage changes in the same tab (custom event)
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartItems());
    };

    // Create custom event listener for same-tab updates
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Also check periodically in case we miss an update
    const interval = setInterval(() => {
      const currentCart = getCartItems();
      if (JSON.stringify(currentCart) !== JSON.stringify(cartItems)) {
        setCartItems(currentCart);
      }
    }, 1000);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, [cartItems]);

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

  const totalItemCount = getTotalItemCount();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Show cart count badge only if there are items */}

      <button
        onClick={handleToggle}
        className="cursor-pointer flex items-center space-x-4 text-gray-700 focus:outline-none"
      >
        {/* User menu */}
        <div className="relative flex items-center justify-center">
          <span className="text-primary-dark space-x-2 focus:outline-none">
            {props?.icon || <BiUser size={24} />}
          </span>
        </div>
        {totalItemCount > 0 && (
          <span className="absolute right-1 -bottom-2 z-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
            {totalItemCount > 99 ? "99+" : totalItemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg bg-white shadow-lg ring-1 ring-gray-200">
          {/* Recently added products */}
          <div className="text-secondary-dark px-4 pt-2 text-sm font-medium">
            Recently added products
          </div>
          <ul className="py-1">
            {cartItems.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-500">
                <div className="text-sm">Your cart is empty</div>
                <div className="mt-1 text-xs">
                  Add some products to get started!
                </div>
              </li>
            ) : (
              cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center px-4 py-2 text-sm transition hover:bg-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mr-2 h-10 w-10 rounded-md object-cover"
                    onError={(e) => {
                      // Fallback image if original fails to load
                      e.currentTarget.src =
                        "https://via.placeholder.com/40x40?text=No+Image";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="ml-auto p-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove from cart"
                  >
                    <IoCloseOutline size={16} />
                  </button>
                </li>
              ))
            )}

            {cartItems.length > 0 && (
              <>
                <li className="border-t border-gray-200"></li>
                <li>
                  <div className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="text-secondary-dark text-sm font-semibold">
                      {cartItems.length} product
                      {cartItems.length !== 1 ? "s" : ""} • {totalItemCount}{" "}
                      item{totalItemCount !== 1 ? "s" : ""}
                    </span>
                    <Link
                      className="text-secondary bg-pink-light flex items-center rounded-md px-4 py-2 text-sm font-medium transition hover:font-bold hover:text-white"
                      to = {ROUTE_BASKET}
                    >
                      Open Shopping bag
                    </Link>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BasketList;
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import useCart from "../../hooks/useCart.ts";
import { ROUTE_CHECKOUT } from "../../constants/routes.ts";
import { useNavigate } from "react-router-dom";
import useOrders from "../../hooks/useOrder.ts";
import { Order } from "../../types/Order.ts";

interface BasketItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  currency?: string;
  addedAt?: string;
  category?: string;
  description?: string;
}

const ShoppingBasket: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<BasketItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  };

  // Load cart items on component mount
  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    // Select all items by default
    setSelectedItems(new Set(items.map(item => item.id)));
  }, []);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        const items = getCartItems();
        setCartItems(items);
        // Update selected items to only include items that still exist
        setSelectedItems(prev => {
          const newSelected = new Set<string>();
          items.forEach(item => {
            if (prev.has(item.id)) {
              newSelected.add(item.id);
            }
          });
          return newSelected;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for localStorage changes in the same tab (custom event)
  useEffect(() => {
    const handleCartUpdate = () => {
      const items = getCartItems();
      setCartItems(items);
      // Update selected items to only include items that still exist
      setSelectedItems(prev => {
        const newSelected = new Set<string>();
        items.forEach(item => {
          if (prev.has(item.id)) {
            newSelected.add(item.id);
          }
        });
        return newSelected;
      });
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

  // Update quantity of an item
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);

    // Remove from selected items
    const newSelectedItems = new Set(selectedItems);
    newSelectedItems.delete(itemId);
    setSelectedItems(newSelectedItems);
  };

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  // Select/deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  // Calculate subtotal for selected items
  const calculateSubtotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total quantity for selected items
  const calculateTotalQuantity = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const { onAddItemsToCart, isLoading: isCartLoading } = useCart();
  const { onRequestOrder, isLoading } = useOrders();


  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one item to checkout');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Get only selected items
      const itemsToCheckout = cartItems
        .filter(item => selectedItems.has(item.id))
        .map(({ id, quantity }) => ({ productId: id, quantity }));

      // // Use Promise to properly handle the async operation and get results
      // const results = await new Promise<any[]>((resolve, reject) => {
      //   onAddItemsToCart(
      //     itemsToCheckout,
      //     (data) => {
      //       resolve(data);
      //     },
      //     (error) => {
      //       reject(error);
      //     }
      //   );
      // });

      // // Extract successful product IDs from results
      // const successfulProductIds = results.map(result => {
      //   // Assuming each result has a productId or we can extract it somehow
      //   // Adjust this based on the actual structure of your API response
      //   return result?.data?.productId || result?.config?.url?.split('/')?.pop() || 'unknown';
      // });

      // Log successful product IDs
      // console.log('Successfully added products:', successfulProductIds);

      const orderItems = itemsToCheckout.map((item) => ({
        productId: item.productId, // Adjust based on your data structure
        quantity: item.quantity,
        note: ""
      }));

      onRequestOrder(
        orderItems,
        (response) => {
          console.log("✅ Order created successfully:", response);
          const remainingItems = cartItems.filter(item => !selectedItems.has(item.id));
          setCartItems(remainingItems);
          saveCartItems(remainingItems);
          setSelectedItems(new Set());
          navigate(`${ROUTE_CHECKOUT}/${response.order.id}`);
        },
        (error: Error) => {
          console.error("❌ Error creating order:", error);
        }
      );

      // Optionally remove checked out items from cart


    } catch (error) {
      console.error('Checkout failed:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Determine if checkout button should be disabled
  const isCheckoutDisabled = selectedItems.size === 0 || isCheckingOut || isCartLoading;

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-primary-dark hover:text-primary-dark">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </div>
          <div className="w-24"></div>
        </div>
        <h1 className="text-xl mb-4 font-bold text-primary-dark">Your Shopping Basket</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 rounded-lg shadow-sm">
              {/* Select All Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                        onChange={toggleSelectAll}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedItems.size === cartItems.length && cartItems.length > 0
                          ? 'bg-pink-light border-pink-light'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.size === cartItems.length && cartItems.length > 0 && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary-dark">
                      Select All ({cartItems.length} items)
                    </span>
                  </label>
                  <span className="text-sm text-primary-dark">
                    {selectedItems.size} of {cartItems.length} selected
                  </span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-primary-dark mb-2">Your cart is empty</h3>
                    <p className="text-primary-dark mb-6">Add some products to get started!</p>
                    <button className="bg-pink-light text-white px-6 py-2 rounded-md hover:bg-pink-light">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <label className="cursor-pointer mt-2">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedItems.has(item.id)
                                ? 'bg-pink-light border-pink-light'
                                : 'border-gray-300'
                            }`}>
                              {selectedItems.has(item.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        </label>

                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/96/96";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-primary-dark mb-1">{item.title}</h3>
                          {item.category && (
                            <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                          )}
                          {item.description && (
                            <p className="text-sm text-primary-dark mb-3">{item.description}</p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-primary-dark">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-dark mb-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            ${item.price.toFixed(2)} each
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-700 hover:text-red-800 hover:scale-110 p-1 transform transition-all"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-primary-dark mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-dark">Items ({calculateTotalQuantity()})</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-dark">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-dark">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-primary-dark">Total</span>
                    <span className="text-lg font-semibold text-primary-dark">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 50 && (
                <div className="bg-pink-light/10 p-3 rounded-md mb-4">
                  <p className="text-sm text-primary-dark">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                  <div className="w-full bg-pink-light/20 rounded-full h-2 mt-2">
                    <div
                      className="bg-pink-light h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isCheckoutDisabled}
                className="w-full bg-pink-light text-white py-3 px-4 rounded-md font-medium hover:bg-pink-light/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  `Checkout (${selectedItems.size} items)`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingBasket;
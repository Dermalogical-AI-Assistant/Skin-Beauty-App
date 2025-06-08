import React, { useState } from 'react';
import { X, Star, Plus, Minus } from "lucide-react";
import { Product } from "../../types/Products.ts";
import { BasketItem } from "../../types/Cart.ts";
import { toast } from "react-toastify";

interface AddProductToBasketProps {
  product: Product;
  onClose?: () => void;
  onViewBasket?: () => void;
  onContinueShopping?: () => void;
}

const AddProductToBasket = ({
                              product,
                              onClose = () => {},
                            }: AddProductToBasketProps) => {

  const [quantity, setQuantity] = useState(1);
  // Quantity handlers
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };


  const [basketItems] = useState(6); // Mock basket item count

  const productSubtotal = (product.price * quantity).toFixed(2);

  const handleClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }
  const existingCartString = localStorage.getItem('cart');
  const cart: BasketItem[] = existingCartString ? JSON.parse(existingCartString) : [];
  const basketTotalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const basketTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

// Add to cart handler
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      image: product.thumbnail,
      title: product.title,
      quantity: quantity,
      price: product.price,
      currency: product.currency,
      addedAt: new Date().toISOString()
    };


    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // If product exists, update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // If new product, add to cart
      cart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success( "Products has been added to basket");
    onClose();
  };
  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50 p-4"
      onClick={(e)=>{ e.stopPropagation(); e.preventDefault(); onClose()}}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium text-gray-900">Added to your basket</h2>
          <button
            onClick={handleClickClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary-dark mb-2 leading-tight">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                {/* Quantity Selector */}
                <div className="mb-6 flex items-center gap-1">
                  <label className="flex text-primary-dark/90 font-medium">Quantity</label>
                  <div className="flex items-center border border-primary-dark/20 rounded-lg w-fit">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 hover:bg-primary-dark/5 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-primary-dark" />
                    </button>
                    <span className={`px-2`}>{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 hover:bg-primary-dark/5 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-primary-dark" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">

                <span className="font-bold text-lg">
                  £{productSubtotal}
                </span>
                {product.price && (
                  <span className="text-gray-400 text-sm">
                  £{product.price.toFixed(2)} each
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Basket Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Basket Subtotal:</span>
              <span className="font-bold">£{Number(basketTotalAmount) + Number(productSubtotal)}</span>
            </div>
            <div className="text-sm text-gray-500">
              ({basketTotalItems + quantity} item{basketTotalItems + quantity !== 1 ? 's' : ''} in your bag)
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors"
            >
              ADD TO BASKET
            </button>
            <button
              onClick={handleClickClose}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductToBasket;

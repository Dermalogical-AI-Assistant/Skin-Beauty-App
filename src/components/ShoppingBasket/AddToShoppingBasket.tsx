import React from "react";
import { BsPlus, BsDash } from "react-icons/bs";
import { Product } from "../../types/Products.ts";
import { Currency } from "../../types/Currency.ts";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  onQuantityChange: (action: 'increase' | 'decrease') => void;
  onAddToCart: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         product,
                                                         quantity,
                                                         onQuantityChange,
                                                         onAddToCart
                                                       }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
      <div
        className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Thêm vào giỏ hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center mb-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
          <div>
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-lg font-semibold text-gray-800">
              {Currency.getSymbol(product.currency)}{product.price}
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng
          </label>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => onQuantityChange('decrease')}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsDash />
            </button>
            <span className="text-xl font-semibold px-4">{quantity}</span>
            <button
              onClick={() => onQuantityChange('increase')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <BsPlus />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="mb-6 text-center">
          <p className="text-lg">
            Tổng cộng: <span className="font-semibold">
              {Currency.getSymbol(product.currency)}{(product.price * quantity).toFixed(2)}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            Hủy
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 py-3 px-4 bg-pink-light text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import useCart from "../../hooks/useCart.ts";
import { ROUTE_CHECKOUT } from "../../constants/routes.ts";
import { useNavigate } from "react-router-dom";
import useOrders from "../../hooks/useOrder.ts";

const OrderPage: React.FC = () => {
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
          hihi
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
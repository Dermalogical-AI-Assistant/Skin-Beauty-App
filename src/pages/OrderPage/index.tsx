import React, { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import TabContent from "../../components/Tab/TabContent.tsx";
import Tab from "../../components/Tab";
import useOrder from "../../hooks/useOrder.ts";
import OrderPageItems from "./OrderPageItems.tsx";
import { OrderStatus } from "../../types/Order.ts";
import { useSearchParams } from "react-router-dom";

const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>();

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const {getMyOrders} = useOrder();
  const {data: orders, isLoading, refetch:refreshOrder} = getMyOrders({
    page: page,
    perPage: perPage,
    status: orderStatus
  });

  const handleTabChange = (value?: OrderStatus) => {
    setOrderStatus(value);
    setPage(0);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('tab', value);
    } else {
      newSearchParams.delete('tab'); // Remove tab param for "All"
    }
    setSearchParams(newSearchParams);

    // Refresh orders after state update
    setTimeout(() => {
      refreshOrder();
    }, 0);
  };

  useEffect(() => {
    if (orders) {
      console.log("Orders fetched:", orders);
    }
  }, [orders]);

  const tabs = [
    {
      label: "All",
      value: undefined,
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Draft Orders",
      value: "DRAFT",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Processing",
      value: "PENDING",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Confirmed",
      value: "CONFIRMED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Delivered",
      value: "DELIVERED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Canceled",
      value: "CANCELED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    }
  ];
  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button className="flex items-center text-primary-dark p-3 rounded-lg hover:drop-shadow-lg cursor-pointer">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
            <span>|</span>
            <h1 className="text-xl font-bold text-primary-dark">My Order</h1>

          </div>
        </div>
        <div className="relative bg-white/50 text-primary-dark rounded-lg shadow-sm border border-gray-200">
          <Tab
            tabs={tabs}
            activeTab={currentTab}
            onTabChange={handleTabChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;


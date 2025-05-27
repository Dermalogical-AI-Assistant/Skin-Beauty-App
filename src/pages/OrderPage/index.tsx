import React, { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import TabContent from "../../components/Tab/TabContent.tsx";
import Tab from "../../components/Tab";
import useOrder from "../../hooks/useOrder.ts";
import OrderPageItems from "./OrderPageItems.tsx";
import { OrderStatus } from "../../types/Order.ts";

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>();

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const {getOrders} = useOrder();
  const {data: orders, isLoading, refetch:refreshOrder} = getOrders({
    page: page,
    perPage: perPage,
    status: orderStatus
  });


  const handleTabChange = (index: number, value?: OrderStatus) => {
    setOrderStatus(value);
    setPage(0);
    refreshOrder();
    setActiveTab(index);
  };

  useEffect(() => {
    if (orders) {
      console.log("Orders fetched:", orders);
    }
  }, [orders]);

  const tabs = [
    {
      label: "All",
      value: null,
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
          </div>
        </TabContent>
      )
    },
    {
      label: "Draft Orders",
      value: "DRAF",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
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
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
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
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
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
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
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
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
          </div>
        </TabContent>
      )
    },
    {
      label: "Completed",
      value: "DELIVERED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrder}/>
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
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

